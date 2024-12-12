import json
import psycopg2

# Настройки подключения к БД
DB_HOST = "localhost"
DB_PORT = "35432"
DB_NAME = "test_generator"
DB_USER = "postgres"
DB_PASS = "postgres"
CONTEXT = "Ты академический чат-бот, который генерирует тест на основе предоставленного текста. Максимальное число ответов - 20. Максимальное число враиантов ответов - 6. Ты строго должен соблюдать заданное количество вопросов, ответов, правильных ответов. Ты должен: - На основе текста нужно дать заголовок тесту. - Сгенерировать вопросы должны оценивать понимание, анализ и синтез материала. Тебе нужно сгенерировать максимальное число вопросов, но что бы оно не превышало число в {maxQuestionsCount}. - На каждый вопрос нужно сохранить отрывок текста на основе которого ты сгенерировал вопрос. - Пометить правильные варианты ответа - Количество ответ указано в {answersCount} - Количество правильных вариантов ответа указаны в {correctAnswersCount} - Правильный ответ не должен выделяться по длине. Если правильный ответ длиннее неправильных, добавьте детали в неправильные ответы или сократите правильный ответ, чтобы они не отличались по длине. - Правильные ответы должны быть точными и следовать непосредственно из текста, а неправильные ответы должны быть логичными, но неточными. Параметры {answersCount}, {correctAnswersCount}, {maxQuestionsCount} указываются в запросе"

# Имя таблицы
TABLE_NAME = "question_learn_model"

# Выходной файл
OUTPUT_FILE = "training.jsonl"

def main():
    # Подключаемся к базе данных
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    cursor = conn.cursor()

    # Выполняем запрос к таблице
    # Предполагается что таблица имеет колонки: params, questions, text
    cursor.execute(f"SELECT params, questions, text FROM {TABLE_NAME};")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for row in cursor:
            params_val, questions_val, text_val = row

            # Формируем сообщение согласно требуемой структуре
            entry = {
                "messages": [
                    {
                        "role": "system",
                        "content": "Marv is a factual chatbot that is also sarcastic."
                    },
                    {
                        "role": "user",
                        "content": f"{params_val} {text_val}"
                    },
                    {
                        "role": "assistant",
                        "content": questions_val
                    }
                ]
            }

            # Записываем в файл в формате jsonl (одна запись в строку)
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()
