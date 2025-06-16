from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder
import asyncio
import logging
import sys

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

API_TOKEN = '7992581735:AAF43YyJL8otNoDIRJBWAR_FpVN4yFsEagQ'
WEBAPP_URL = 'https://khimarri.github.io/khimari/'  # Ваша ссылка на GitHub Pages

try:
    bot = Bot(token=API_TOKEN)
    dp = Dispatcher()
except Exception as e:
    logger.error(f"Ошибка при инициализации бота: {e}")
    sys.exit(1)

@dp.message(Command("start"))
async def send_welcome(message: types.Message):
    try:
        if not message.from_user:
            logger.error("Получено сообщение без информации о пользователе")
            return

        user_id = message.from_user.id
        user_name = message.from_user.first_name or "Пользователь"
        
        logger.info(f"Получена команда /start от пользователя {user_id}")
        
        builder = InlineKeyboardBuilder()
        web_app = WebAppInfo(url=WEBAPP_URL)
        builder.add(InlineKeyboardButton(
            text="🚀 Открыть мини-приложение",
            web_app=web_app
        ))
        
        welcome_text = (
            f"👋 Привет, {user_name}!\n\n"
            "Добро пожаловать в систему управления доступом.\n"
            "Нажмите кнопку ниже, чтобы открыть мини-приложение:"
        )
        
        await message.answer(
            welcome_text,
            reply_markup=builder.as_markup()
        )
        logger.info(f"Приветственное сообщение отправлено пользователю {user_id}")
        
    except Exception as e:
        logger.error(f"Ошибка при отправке приветственного сообщения: {e}")
        await message.answer(
            "😔 Произошла ошибка при запуске бота. Пожалуйста, попробуйте позже."
        )

@dp.message()
async def echo(message: types.Message):
    try:
        if not message.from_user:
            logger.error("Получено сообщение без информации о пользователе")
            return

        user_id = message.from_user.id
        logger.info(f"Получено сообщение от пользователя {user_id}: {message.text}")
        
        await message.answer(
            "Для начала работы с ботом используйте команду /start"
        )
    except Exception as e:
        logger.error(f"Ошибка при обработке сообщения: {e}")

async def main():
    try:
        logger.info("Запуск бота...")
        await dp.start_polling(bot)
    except Exception as e:
        logger.error(f"Ошибка при запуске бота: {e}")
        sys.exit(1)

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Бот остановлен пользователем")
    except Exception as e:
        logger.error(f"Критическая ошибка: {e}")
        sys.exit(1) 