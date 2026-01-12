import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Получение истории заказов пользователя'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()

        query = '''
            SELECT 
                id,
                order_number,
                amount,
                status,
                created_at,
                paid_at
            FROM t_p49988359_telegram_mini_app_9.orders
            ORDER BY created_at DESC
            LIMIT 50
        '''
        
        cur.execute(query)
        rows = cur.fetchall()

        orders = []
        for row in rows:
            order_id, order_number, amount, status, created_at, paid_at = row
            
            if status == 'succeeded' or status == 'paid':
                operation_type = 'deposit'
            elif status == 'pending':
                operation_type = 'pending'
            else:
                operation_type = 'failed'

            orders.append({
                'id': order_id,
                'type': operation_type,
                'amount': float(amount),
                'date': created_at.strftime('%d.%m.%Y') if created_at else '',
                'status': status
            })

        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'orders': orders}),
            'isBase64Encoded': False
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
