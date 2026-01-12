import json
import os
import hashlib
import psycopg2
from urllib.parse import parse_qs


def calculate_signature(*args) -> str:
    """Создание MD5 подписи по документации Robokassa"""
    joined = ':'.join(str(arg) for arg in args)
    return hashlib.md5(joined.encode()).hexdigest().upper()


def get_db_connection():
    """Получение подключения к БД"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not configured')
    return psycopg2.connect(dsn)


HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/plain'
}


def handler(event: dict, context) -> dict:
    '''
    Result URL вебхук от Robokassa для подтверждения оплаты.
    Robokassa отправляет: OutSum, InvId, SignatureValue
    Returns: OK{InvId} если подпись верна и заказ обновлён
    '''
    method = event.get('httpMethod', 'GET').upper()

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': '', 'isBase64Encoded': False}

    password_2 = os.environ.get('ROBOKASSA_PASSWORD_2')
    if not password_2:
        return {'statusCode': 500, 'headers': HEADERS, 'body': 'Configuration error', 'isBase64Encoded': False}

    # Парсинг параметров из body или query string
    params = {}
    body = event.get('body', '')

    if method == 'POST' and body:
        if event.get('isBase64Encoded', False):
            import base64
            body = base64.b64decode(body).decode('utf-8')
        parsed = parse_qs(body)
        params = {k: v[0] for k, v in parsed.items()}

    if not params:
        params = event.get('queryStringParameters') or {}

    out_sum = params.get('OutSum', params.get('out_summ', ''))
    inv_id = params.get('InvId', params.get('inv_id', ''))
    signature_value = params.get('SignatureValue', params.get('crc', '')).upper()

    if not out_sum or not inv_id or not signature_value:
        return {'statusCode': 400, 'headers': HEADERS, 'body': 'Missing required parameters', 'isBase64Encoded': False}

    # Проверка подписи
    expected_signature = calculate_signature(out_sum, inv_id, password_2)
    if signature_value != expected_signature:
        return {'statusCode': 400, 'headers': HEADERS, 'body': 'Invalid signature', 'isBase64Encoded': False}

    # Обновление статуса заказа
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE t_p49988359_telegram_mini_app_9.orders
        SET status = 'paid', paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE robokassa_inv_id = %s AND status = 'pending'
        RETURNING id, order_number, user_email, amount
    """, (int(inv_id),))

    result = cur.fetchone()

    if not result:
        cur.execute("SELECT status FROM t_p49988359_telegram_mini_app_9.orders WHERE robokassa_inv_id = %s", (int(inv_id),))
        existing = cur.fetchone()
        conn.close()

        if existing and existing[0] == 'paid':
            return {'statusCode': 200, 'headers': HEADERS, 'body': f'OK{inv_id}', 'isBase64Encoded': False}
        return {'statusCode': 404, 'headers': HEADERS, 'body': 'Order not found', 'isBase64Encoded': False}

    order_id, order_number, user_email, amount = result
    
    telegram_id = user_email.replace('@telegram.user', '') if '@telegram.user' in user_email else None
    
    if telegram_id:
        cur.execute(
            'SELECT id, referred_by_id, first_deposit_at FROM t_p49988359_telegram_mini_app_9.users WHERE telegram_id = %s',
            (telegram_id,)
        )
        user_data = cur.fetchone()
        
        if user_data:
            user_id, referred_by_id, first_deposit_at = user_data
            
            cur.execute(
                'UPDATE t_p49988359_telegram_mini_app_9.users SET total_deposits = total_deposits + %s WHERE id = %s',
                (float(out_sum), user_id)
            )
            
            if referred_by_id:
                is_first_deposit = first_deposit_at is None
                
                if is_first_deposit:
                    cur.execute(
                        'UPDATE t_p49988359_telegram_mini_app_9.users SET first_deposit_at = CURRENT_TIMESTAMP WHERE id = %s',
                        (user_id,)
                    )
                    
                    cur.execute(
                        'SELECT bonus_amount FROM t_p49988359_telegram_mini_app_9.bonus_settings WHERE bonus_type = %s AND is_active = true',
                        ('referral_first_deposit',)
                    )
                    first_deposit_bonus_result = cur.fetchone()
                    
                    if first_deposit_bonus_result:
                        first_deposit_bonus = first_deposit_bonus_result[0]
                        
                        cur.execute(
                            '''UPDATE t_p49988359_telegram_mini_app_9.users 
                               SET balance = balance + %s, referral_earnings = referral_earnings + %s 
                               WHERE id = %s''',
                            (first_deposit_bonus, first_deposit_bonus, referred_by_id)
                        )
                        
                        cur.execute(
                            '''INSERT INTO t_p49988359_telegram_mini_app_9.referral_earnings 
                               (user_id, referral_id, amount, order_id, bonus_type, description, created_at) 
                               VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)''',
                            (referred_by_id, user_id, first_deposit_bonus, order_id, 'referral_first_deposit', 'Бонус за первый депозит реферала')
                        )
                
                cur.execute(
                    'SELECT bonus_percentage FROM t_p49988359_telegram_mini_app_9.bonus_settings WHERE bonus_type = %s AND is_active = true',
                    ('referral_commission',)
                )
                commission_result = cur.fetchone()
                
                if commission_result:
                    commission_percentage = commission_result[0]
                    commission_amount = float(out_sum) * (float(commission_percentage) / 100)
                    
                    cur.execute(
                        '''UPDATE t_p49988359_telegram_mini_app_9.users 
                           SET balance = balance + %s, referral_earnings = referral_earnings + %s 
                           WHERE id = %s''',
                        (commission_amount, commission_amount, referred_by_id)
                    )
                    
                    cur.execute(
                        '''INSERT INTO t_p49988359_telegram_mini_app_9.referral_earnings 
                           (user_id, referral_id, amount, order_id, bonus_type, description, created_at) 
                           VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)''',
                        (referred_by_id, user_id, commission_amount, order_id, 'referral_commission', f'Комиссия {commission_percentage}% от депозита')
                    )

    conn.commit()
    cur.close()
    conn.close()

    return {'statusCode': 200, 'headers': HEADERS, 'body': f'OK{inv_id}', 'isBase64Encoded': False}