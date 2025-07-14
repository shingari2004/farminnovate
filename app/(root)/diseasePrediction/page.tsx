'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Camera, AlertCircle, Loader2, RefreshCw, ExternalLink } from 'lucide-react';

interface PredictionResponse {
  result: string;
  confidence: number;
  error?: string;
}

const DiseasePrediction: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | null>(null);
  
  const router = useRouter();

  // Updated with your actual Render deployment URL (removed double slash)
  const RENDER_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://disease-detection-e8br.onrender.com';

  // Test API connection
  const testConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch(`${RENDER_API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setConnectionStatus('connected');
        setError(null);
      } else {
        setConnectionStatus('disconnected');
        setError(`API returned status: ${response.status}. Service might be starting up.`);
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('Connection test failed:', error);
      setError('Cannot connect to ML service. Please check if the service is running.');
    }
  };

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    
    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (allowedTypes.includes(droppedFile.type)) {
        handleFileChange(droppedFile);
      } else {
        setError('Please select a valid image file (PNG, JPG, or JPEG)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const apiUrl = `${RENDER_API_URL}/predict`;
      console.log('API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // Add timeout and better error handling
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          
          // Try to parse JSON error
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = `Server error: ${errorData.error}`;
          } else if (errorData.message) {
            errorMessage = `Server error: ${errorData.message}`;
          }
        } catch (parseError) {
          console.log('Could not parse error response');
          console.error('Error parsing response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data: PredictionResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.log('JSON parsing error:', parseError);
        const fixedText = responseText.replace(/:\s*NaN/g, ': 0');
        
        try {
          data = JSON.parse(fixedText);
        } catch (secondParseError) {
          console.error('Failed to parse response:', fixedText);
          console.error('Original response:', secondParseError);
          throw new Error(`Invalid response format: ${responseText.substring(0, 200)}...`);
        }
      }

      console.log('Parsed data:', data);

      // Ensure confidence is a valid number
      if (isNaN(data.confidence)) {
        console.warn('Confidence is NaN, setting to 0');
        data.confidence = 0;
      }

      if (data.result) {
        // Store prediction data for the result page
        const predictionData = {
          result: data.result,
          confidence: data.confidence,
          image: imagePreview
        };

        localStorage.setItem('predictionResult', JSON.stringify(predictionData));

        const params = new URLSearchParams({
          result: data.result,
          confidence: data.confidence.toString()
        });

        router.push(`/diseasePrediction/result?${params.toString()}`);
      } else {
        setError(data.error || 'Prediction failed. Please try again.');
      }
    } catch (error) {
      console.error('Error making prediction:', error);
      
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          setError('Request timed out. The ML service might be slow or unavailable.');
        } else if (error.message.includes('Failed to fetch')) {
          setError('Connection failed. This might be due to CORS issues or the API being unavailable.');
        } else if (error.message.includes('NetworkError')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(`Error: ${error.message}`);
        }
      } else {
        setError('Unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setImagePreview(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Plant Disease Detection
          </h1>
          <p className="text-gray-600 text-lg">
            Upload an image of your plant to detect diseases using AI
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'disconnected' ? 'bg-red-500' : 
                connectionStatus === 'checking' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm font-medium">
                ML Service Status: {
                  connectionStatus === 'connected' ? 'Connected' : 
                  connectionStatus === 'disconnected' ? 'Disconnected' : 
                  connectionStatus === 'checking' ? 'Checking...' : 'Unknown'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={testConnection}
                disabled={connectionStatus === 'checking'}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
                Test Connection
              </button>
              <a
                href={RENDER_API_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <ExternalLink className="w-4 h-4" />
                Open API
              </a>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Plant Image
              </label>
              
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                  dragActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md mb-4"
                    />
                    <p className="text-sm text-gray-600 mb-2">
                      {file?.name} ({(file?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="text-red-600 hover:text-red-700 text-sm underline"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg text-gray-700">
                        Drag and drop your image here, or{' '}
                        <label className="text-green-600 hover:text-green-700 cursor-pointer underline">
                          browse
                          <input
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            onChange={handleInputChange}
                            className="hidden"
                            disabled={loading}
                          />
                        </label>
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PNG, JPG, JPEG (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!file || loading}
              className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-medium transition-colors ${
                !file || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Detect Disease
                </>
              )}
            </button>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Troubleshooting Connection Issues:
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Check if your ML service is running on Render</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Verify the API URL is correct in your environment variables</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Ensure your ML service has CORS enabled for your domain</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Free tier services on Render may sleep after inactivity</span>
            </li>
          </ul>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            How to get the best results:
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Take clear, well-lit photos of affected plant parts</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Focus on leaves, stems, or fruits showing symptoms</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Avoid blurry or heavily shadowed images</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Include enough context to show the affected area clearly</span>
            </li>
          </ul>
        </div>

        {/* Supported Plants */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Supported Plants:
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="space-y-1">
              <div className="font-medium">Fruits</div>
              <div>Apple, Orange, Peach</div>
              <div>Grape, Strawberry</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Vegetables</div>
              <div>Tomato, Potato, Pepper</div>
              <div>Corn, Squash</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Berries</div>
              <div>Blueberry, Raspberry</div>
              <div>Cherry</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Crops</div>
              <div>Soybean</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseasePrediction;