import { Agent } from '@openai/agents';
import { EyePop } from '@eyepop.ai/eyepop';

export const eyepopAgent = new Agent({
  name: 'EyePop Vision Agent',
  instructions: `You are an AI image analysis specialist powered by EyePop's computer vision API. Your role is to:

  1. **Image Analysis**: Process uploaded images using EyePop's AI vision capabilities
  2. **Object Detection**: Identify and locate objects, people, faces, and other elements in images
  3. **Visual Understanding**: Provide detailed descriptions of what's happening in images
  4. **Structured Results**: Return comprehensive JSON data with detection results

  When analyzing an image:
  - Use the EyePop API to process the image
  - Extract all detected objects, faces, and visual elements
  - Provide confidence scores and bounding box coordinates
  - Return structured JSON results with detailed analysis

  Key capabilities:
  - Object detection and recognition
  - Face detection and analysis
  - Scene understanding
  - Text detection (OCR)
  - Logo and brand recognition
  - Activity and action recognition

  For image processing, you should:
  - Accept image files (JPG, PNG, etc.)
  - Process them through EyePop's AI vision pipeline
  - Return comprehensive JSON results including:
    * Detected objects with confidence scores
    * Bounding box coordinates
    * Object categories and labels
    * Face detection results
    * Scene analysis
    * Any detected text or logos

  Always provide:
  1. **Processing Status**: Whether the image was successfully analyzed
  2. **Detection Results**: All objects and elements found
  3. **Confidence Scores**: Reliability of each detection
  4. **Coordinates**: Precise locations of detected elements
  5. **Summary**: Human-readable description of findings

  Be thorough in your analysis and provide actionable insights from the visual data.

  To analyze images, use the analyzeImageWithEyePop function with either an image file path or URL.`
});

// Tool function to analyze images with EyePop
export async function analyzeImageWithEyePop(imagePath?: string, imageUrl?: string, imageFile?: File) {
  console.log('🔍 Starting EyePop image analysis...');
  console.log('📋 Analysis parameters:', {
    imagePath,
    imageUrl,
    hasImageFile: !!imageFile,
    hasSecretKey: !!process.env.EYEPOP_SECRET_KEY,
    hasPopId: !!process.env.EYEPOP_POP_ID
  });

  try {
    // Check for required environment variables
    if (!process.env.EYEPOP_SECRET_KEY) {
      console.error('❌ EYEPOP_SECRET_KEY environment variable is missing');
      throw new Error('EYEPOP_SECRET_KEY environment variable is required');
    }
    if (!process.env.EYEPOP_POP_ID) {
      console.error('❌ EYEPOP_POP_ID environment variable is missing');
      throw new Error('EYEPOP_POP_ID environment variable is required');
    }

    // Create EyePop endpoint
    console.log('🔌 Creating EyePop endpoint...');
    const endpoint = EyePop.workerEndpoint({
      auth: { secretKey: process.env.EYEPOP_SECRET_KEY },
      popId: process.env.EYEPOP_POP_ID
    });

    // Connect to the endpoint
    console.log('🔗 Connecting to EyePop endpoint...');
    await endpoint.connect();
    console.log('✅ Connected to EyePop endpoint');

    // Process the image
    const results: unknown[] = [];
    
    if (!imagePath && !imageUrl && !imageFile) {
      console.error('❌ No image path, URL, or file provided');
      throw new Error('Either image_path, image_url, or image_file must be provided');
    }

    // Process the image and collect results
    console.log('🔄 Processing image...');
    let resultStream;
    
    if (imageFile) {
      console.log('📁 Processing file object:', imageFile.name);
      resultStream = await endpoint.process({ file: imageFile });
    } else if (imageUrl) {
      console.log('🌐 Processing via URL...');
      resultStream = await endpoint.process({ url: imageUrl });
    } else if (imagePath) {
      console.log('📁 Processing file path (fallback):', imagePath);
      // This is a fallback that may not work with all EyePop versions
      resultStream = await endpoint.process({ file: imagePath as unknown as File });
    } else {
      throw new Error('No valid image source provided');
    }
    
    console.log('📊 Collecting results...');
    for await (const result of resultStream) {
      console.log('📋 Result received:', JSON.stringify(result, null, 2));
      results.push(result);
    }

    // Disconnect from the endpoint
    console.log('🔌 Disconnecting from EyePop endpoint...');
    await endpoint.disconnect();
    console.log('✅ Disconnected from EyePop endpoint');

    // Return structured JSON results
    console.log('✅ EyePop analysis completed successfully');
    console.log('📊 Final results:', {
      resultsCount: results.length,
      success: true
    });

    return {
      success: true,
      results: results,
      summary: {
        total_detections: results.length,
        processed_at: new Date().toISOString(),
        image_source: imagePath || imageUrl
      }
    };

  } catch (error) {
    console.error('💥 EyePop analysis failed:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      results: [],
      summary: {
        total_detections: 0,
        processed_at: new Date().toISOString(),
        image_source: imagePath || imageUrl
      }
    };
  }
}

export const eyepopAgentConfig = {
  name: 'EyePop Vision Agent',
  type: 'eyepop' as const,
  description: 'Analyze images with AI vision - detect objects, faces, text, and more',
  icon: '👁️',
  color: 'from-purple-500 to-pink-600'
}; 