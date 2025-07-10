import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageWithEyePop } from '../../lib/agents/eyepop';

export async function POST(req: NextRequest) {
  console.log('🚀 Starting upload-image API route...');
  
  try {
    console.log('📋 Parsing form data...');
    const formData = await req.formData();
    const imageData = formData.get('image');
    const message = formData.get('message') as string;
    const preferredAgent = formData.get('preferredAgent') as string;

    // Ensure image is a File object
    if (!(imageData instanceof File)) {
      console.error('❌ Image data is not a File object');
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }
    
    const image = imageData;

    console.log('📋 Request details:', {
      hasImage: !!image,
      imageSize: image?.size,
      imageType: image?.type,
      imageName: image?.name,
      message,
      preferredAgent
    });

    if (!image) {
      console.error('❌ No image provided');
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    if (preferredAgent !== 'eyepop') {
      console.error('❌ Invalid agent type:', preferredAgent);
      return NextResponse.json(
        { error: 'This endpoint is only for EyePop agent' },
        { status: 400 }
      );
    }

    // Analyze the image with EyePop directly using the File object
    console.log('🔍 Starting EyePop analysis with File object...');
    const analysisResult = await analyzeImageWithEyePop(undefined, undefined, image);
    console.log('📊 EyePop analysis result:', {
      success: analysisResult.success,
      error: analysisResult.error,
      resultsCount: analysisResult.results?.length || 0
    });

    if (!analysisResult.success) {
      console.error('❌ EyePop analysis failed:', analysisResult.error);
      return NextResponse.json(
        { error: analysisResult.error },
        { status: 500 }
      );
    }

    // Format the response for the user
    const userMessage = message || 'Please analyze this image';
    const imageAnalysis = analysisResult.results;
    const summary = analysisResult.summary;

    let response = `# 🔍 Image Analysis Results\n\n`;
    
    if (userMessage && userMessage !== 'Please analyze this image') {
      response += `**Your request:** ${userMessage}\n\n`;
    }
    
    response += `**Image:** ${image.name}\n`;
    response += `**Processed:** ${summary.processed_at}\n`;
    response += `**Total detections:** ${summary.total_detections}\n\n`;

    if (imageAnalysis && imageAnalysis.length > 0) {
      response += `## 🎯 Detected Objects\n\n`;
      
      (imageAnalysis as Array<{ objects?: Array<{ classLabel: string; confidence: number; x: number; y: number; width: number; height: number; classes?: Array<{ classLabel: string; confidence: number }> }> }>).forEach((result, index: number) => {
        if (result.objects && result.objects.length > 0) {
          response += `**Frame ${index + 1}:**\n`;
          result.objects.forEach((obj, objIndex: number) => {
            response += `${objIndex + 1}. **${obj.classLabel}** (${Math.round(obj.confidence * 100)}% confidence)\n`;
            response += `   - Position: (${Math.round(obj.x)}, ${Math.round(obj.y)})\n`;
            response += `   - Size: ${Math.round(obj.width)} × ${Math.round(obj.height)}\n`;
            
            if (obj.classes && obj.classes.length > 0) {
              response += `   - Additional info: `;
              obj.classes.forEach((cls, clsIndex: number) => {
                response += `${cls.classLabel} (${Math.round(cls.confidence * 100)}%)`;
                if (clsIndex < (obj.classes?.length || 0) - 1) response += ', ';
              });
              response += '\n';
            }
            response += '\n';
          });
        }
      });
    } else {
      response += `## 📝 Analysis Summary\n\n`;
      response += `No specific objects were detected in this image. This could mean:\n`;
      response += `- The image contains abstract content\n`;
      response += `- The objects are not in the detection model's training data\n`;
      response += `- The image quality may need improvement\n\n`;
    }

    response += `## 🔧 Technical Details\n\n`;
    response += `\`\`\`json\n${JSON.stringify(analysisResult, null, 2)}\n\`\`\`\n\n`;
    response += `*This analysis was powered by EyePop.ai's computer vision API*`;

    console.log('✅ Upload-image API route completed successfully');
    return NextResponse.json({
      response: response,
      agentUsed: 'eyepop',
      timestamp: new Date().toISOString(),
      imageAnalysis: analysisResult
    });

  } catch (error) {
    console.error('💥 Error processing image upload:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'An error occurred while processing your image' },
      { status: 500 }
    );
  }
} 