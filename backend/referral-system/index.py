import json
import os
import psycopg2
import hashlib

def handler(event: dict, context) -> dict:
    '''Реферальная система: регистрация пользователей и статистика'''
    method = event.get('httpMethod', 'GET')
    path = event.get('queryStringParameters', {}).get('action', 'register')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        if method == 'POST' or path == 'register':
            body = json.loads(event.get('body', '{}'))
            telegram_id = body.get('telegram_id')
            first_name = body.get('first_name')
            last_name = body.get('last_name')
            username = body.get('username')
            referral_code = body.get('referral_code')
            
            if not telegram_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'telegram_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                'SELECT id, referral_code, balance, referral_earnings FROM t_p49988359_telegram_mini_app_9.users WHERE telegram_id = %s',
                (str(telegram_id),)
            )
            existing_user = cur.fetchone()
            
            if existing_user:
                user_id, user_ref_code, balance, ref_earnings = existing_user
                cur.execute(
                    'UPDATE t_p49988359_telegram_mini_app_9.users SET last_login_at = CURRENT_TIMESTAMP WHERE id = %s',
                    (user_id,)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user_id': user_id,
                        'referral_code': user_ref_code,
                        'balance': float(balance or 0),
                        'referral_earnings': float(ref_earnings or 0),
                        'is_new': False
                    }),
                    'isBase64Encoded': False
                }
            
            name = ' '.join(filter(None, [first_name, last_name])) or username or 'User'
            
            referred_by_id = None
            if referral_code:
                cur.execute(
                    'SELECT id FROM t_p49988359_telegram_mini_app_9.users WHERE referral_code = %s',
                    (referral_code,)
                )
                referrer = cur.fetchone()
                if referrer:
                    referred_by_id = referrer[0]
            
            cur.execute(
                '''INSERT INTO t_p49988359_telegram_mini_app_9.users 
                   (telegram_id, name, referred_by_id, created_at, last_login_at) 
                   VALUES (%s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
                   RETURNING id''',
                (str(telegram_id), name, referred_by_id)
            )
            new_user_id = cur.fetchone()[0]
            
            unique_code = 'REF' + str(new_user_id).zfill(6) + hashlib.md5(str(telegram_id).encode()).hexdigest()[:4].upper()
            
            cur.execute(
                'UPDATE t_p49988359_telegram_mini_app_9.users SET referral_code = %s WHERE id = %s',
                (unique_code, new_user_id)
            )
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'user_id': new_user_id,
                    'referral_code': unique_code,
                    'balance': 0,
                    'referral_earnings': 0,
                    'is_new': True
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'GET' and path == 'stats':
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                '''SELECT COUNT(*) as total_referrals,
                          COUNT(CASE WHEN last_login_at > NOW() - INTERVAL '30 days' THEN 1 END) as active_referrals
                   FROM t_p49988359_telegram_mini_app_9.users 
                   WHERE referred_by_id = %s''',
                (int(user_id),)
            )
            result = cur.fetchone()
            total_referrals = result[0] if result else 0
            active_referrals = result[1] if result else 0
            
            cur.execute(
                '''SELECT u.name, u.telegram_id, u.created_at, u.last_login_at
                   FROM t_p49988359_telegram_mini_app_9.users u
                   WHERE u.referred_by_id = %s
                   ORDER BY u.created_at DESC
                   LIMIT 50''',
                (int(user_id),)
            )
            referrals = []
            for row in cur.fetchall():
                name, telegram_id, created_at, last_login_at = row
                is_active = last_login_at and (last_login_at.timestamp() * 1000) > (
                    (created_at.timestamp() * 1000) - (30 * 24 * 60 * 60 * 1000)
                ) if created_at and last_login_at else False
                
                referrals.append({
                    'name': name,
                    'telegram_id': telegram_id,
                    'joined_at': created_at.strftime('%d.%m.%Y') if created_at else '',
                    'is_active': is_active
                })
            
            cur.execute(
                '''SELECT COALESCE(SUM(amount), 0) as total_earnings
                   FROM t_p49988359_telegram_mini_app_9.referral_earnings
                   WHERE user_id = %s''',
                (int(user_id),)
            )
            result = cur.fetchone()
            total_earnings = float(result[0]) if result else 0
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'total_referrals': total_referrals,
                    'active_referrals': active_referrals,
                    'total_earnings': total_earnings,
                    'referrals': referrals
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
