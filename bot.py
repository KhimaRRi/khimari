from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder
import asyncio

API_TOKEN = '7992581735:AAF43YyJL8otNoDIRJBWAR_FpVN4yFsEagQ'
WEBAPP_URL = 'https://khimarri.github.io/khimari/'  # Ваша ссылка на GitHub Pages

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def send_welcome(message: types.Message):
    builder = InlineKeyboardBuilder()
    web_app = WebAppInfo(url=WEBAPP_URL)
    builder.add(InlineKeyboardButton(text="Открыть мини-приложение", web_app=web_app))
    
    await message.answer(
        "Добро пожаловать! Нажмите кнопку ниже, чтобы открыть мини-приложение:",
        reply_markup=builder.as_markup()
    )

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main()) 