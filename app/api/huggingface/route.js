import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const apiKey = process.env.TOGETHER_API_KEY; // Store your API key in an environment variable
        const { inputs } = await req.json();

       // console.log("API Key:", process.env.TOGETHER_API_KEY); // Add this line to verify API key
        
        console.log("Received input:", inputs); // Log the input to debug
        //https://huggingface.co/aisak-ai/aisak-assistant
        const response = await fetch('https://api-inference.huggingface.co/models/aisak-ai/aisak-assistant', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ inputs }),
            });

        if (response.ok) {
            const data = await response.json();
            console.log("API Response:", data); // Log the response from Hugging Face API
            return NextResponse.json({ response: data }); // Send the API response back to the frontend
        } else {
            const errorData = await response.json();
            console.error("Error from Hugging Face API:", errorData);
            return NextResponse.json({ error: 'Error calling Hugging Face API', details: errorData }, { status: response.status });
        }
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: 'Server Error', details: error.message }, { status: 500 });
    }
}
