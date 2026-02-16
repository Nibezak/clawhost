import asyncio
import edge_tts

async def main():
    text = "There isn’t an Apple “approval board” you wait for — as long as you set up these certificates, your merchant ID, and integrate the payment API correctly, Apple Pay will work. But your payment processor might have its own approval process (e.g., Stripe might review your business)."
    communicate = edge_tts.Communicate(text, "en-US-AndrewMultilingualNeural")
    await communicate.save("output.mp3")
    print("Done! Saved output.mp3")

asyncio.run(main())