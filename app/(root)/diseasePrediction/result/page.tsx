'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Camera, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Leaf, 
  Bug, 
  Shield,
  Download,
  RefreshCw
} from 'lucide-react';

interface PredictionResult {
  result: string;
  confidence: number;
  image?: string;
}

interface DiseaseInfo {
  name: string;
  category: 'healthy' | 'disease';
  severity: 'low' | 'medium' | 'high';
  description: string;
  causes: string[];
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}

// Loading component for Suspense fallback
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading prediction results...</p>
    </div>
  </div>
);

// Main component that uses useSearchParams
const DiseasePredictionResultContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [predictionData, setPredictionData] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get data from URL params first
    const result = searchParams.get('result');
    const confidence = searchParams.get('confidence');
    const imageKey = searchParams.get('imageKey'); // If using Option 2C
    
    if (result && confidence) {
      // Get image from sessionStorage
      let imageData = null;
      
      if (imageKey) {
        // Option 2C: Get image by key
        imageData = sessionStorage.getItem(imageKey);
      } else {
        // Fallback: try to get from stored prediction data
        try {
          const storedData = sessionStorage.getItem('predictionResult');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            imageData = parsedData.image;
          }
        } catch (err) {
          console.log(err);
          console.warn('Could not retrieve image from sessionStorage');
        }
      }
      
      setPredictionData({
        result,
        confidence: parseFloat(confidence),
        image: imageData || undefined
      });
      setLoading(false);
    } else {
      // Fallback to sessionStorage for all data
      try {
        const storedData = sessionStorage.getItem('predictionResult');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setPredictionData(parsedData);
        } else {
          setError('No prediction data found');
        }
      } catch (err) {
        console.log(err);
        setError('Failed to load prediction data');
      }
      setLoading(false);
    }
  }, [searchParams]);

  const getDiseaseInfo = (diseaseName: string): DiseaseInfo => {
    const isHealthy = diseaseName.toLowerCase().includes('healthy');
    
    // This is a simplified disease database - you should expand this
    const diseaseDatabase: Record<string, Partial<DiseaseInfo>> = {
      'Apple scab': {
        category: 'disease',
        severity: 'medium',
        description: 'A fungal disease that affects apple trees, causing dark, scaly lesions on leaves and fruit.',
        causes: ['Venturia inaequalis fungus', 'Wet, humid conditions', 'Poor air circulation'],
        symptoms: ['Dark, scaly spots on leaves', 'Fruit deformation', 'Premature leaf drop'],
        treatment: ['Apply fungicides', 'Remove infected leaves', 'Improve air circulation'],
        prevention: ['Choose resistant varieties', 'Proper pruning', 'Avoid overhead watering']
      },
      'Tomato Late blight': {
        category: 'disease',
        severity: 'high',
        description: 'A serious fungal disease that can destroy entire tomato crops rapidly.',
        causes: ['Phytophthora infestans', 'Cool, wet weather', 'High humidity'],
        symptoms: ['Water-soaked spots on leaves', 'White fungal growth', 'Fruit rot'],
        treatment: ['Apply copper-based fungicides', 'Remove affected plants', 'Improve drainage'],
        prevention: ['Plant resistant varieties', 'Ensure good air circulation', 'Avoid wet foliage']
      },
      // Add more diseases as needed...
    };

    const baseInfo: DiseaseInfo = {
      name: diseaseName,
      category: isHealthy ? 'healthy' : 'disease',
      severity: isHealthy ? 'low' : 'medium',
      description: isHealthy 
        ? 'Your plant appears to be healthy with no visible signs of disease.'
        : 'A plant disease has been detected. Please review the information below.',
      causes: isHealthy ? [] : ['Various factors can cause plant diseases'],
      symptoms: isHealthy ? ['Vibrant green color', 'No visible spots or lesions'] : ['Visible symptoms detected'],
      treatment: isHealthy ? ['Continue regular care'] : ['Consult with plant care experts'],
      prevention: isHealthy ? ['Maintain current care routine'] : ['Follow prevention guidelines']
    };

    return { ...baseInfo, ...diseaseDatabase[diseaseName] };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const handleNewPrediction = () => {
    // Clear stored data
    sessionStorage.removeItem('predictionResult');
    router.push('/diseasePrediction');
  };

  const handleDownloadReport = () => {
    if (!predictionData) return;
    
    const diseaseInfo = getDiseaseInfo(predictionData.result);
    const reportContent = `
Plant Disease Detection Report
Generated: ${new Date().toLocaleString()}

Prediction Result: ${predictionData.result}
Confidence: ${(predictionData.confidence * 100).toFixed(1)}%

Disease Information:
${diseaseInfo.description}

${diseaseInfo.category === 'disease' ? `
Symptoms:
${diseaseInfo.symptoms.map(s => `• ${s}`).join('\n')}

Treatment:
${diseaseInfo.treatment.map(t => `• ${t}`).join('\n')}

Prevention:
${diseaseInfo.prevention.map(p => `• ${p}`).join('\n')}
` : ''}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plant-disease-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading prediction results...</p>
        </div>
      </div>
    );
  }

  if (error || !predictionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-6">{error || 'No prediction data available'}</p>
          <button
            onClick={handleNewPrediction}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Start New Prediction
          </button>
        </div>
      </div>
    );
  }

  const diseaseInfo = getDiseaseInfo(predictionData.result);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Upload
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button
              onClick={handleNewPrediction}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
              New Prediction
            </button>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Image Section */}
            {predictionData.image && (
              <div className="md:w-1/2">
                <img
                  src={predictionData.image}
                  alt="Analyzed plant"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
            )}
            
            {/* Results Section */}
            <div className={`${predictionData.image ? 'md:w-1/2' : 'w-full'} p-8`}>
              <div className="flex items-center gap-3 mb-6">
                {diseaseInfo.category === 'healthy' ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {predictionData.result}
                  </h1>
                  <p className={`text-sm font-medium ${getConfidenceColor(predictionData.confidence)}`}>
                    {getConfidenceText(predictionData.confidence)} ({(predictionData.confidence * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Confidence Level</span>
                    <span>{(predictionData.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        predictionData.confidence >= 0.8 ? 'bg-green-500' :
                        predictionData.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${predictionData.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{diseaseInfo.description}</p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    diseaseInfo.category === 'healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {diseaseInfo.category === 'healthy' ? (
                      <Shield className="w-4 h-4 mr-1" />
                    ) : (
                      <Bug className="w-4 h-4 mr-1" />
                    )}
                    {diseaseInfo.category === 'healthy' ? 'Healthy' : 'Disease Detected'}
                  </span>
                  {diseaseInfo.category === 'disease' && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      diseaseInfo.severity === 'high' ? 'bg-red-100 text-red-800' :
                      diseaseInfo.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {diseaseInfo.severity.charAt(0).toUpperCase() + diseaseInfo.severity.slice(1)} Severity
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        {diseaseInfo.category === 'disease' && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Symptoms */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Symptoms</h2>
              </div>
              <ul className="space-y-2">
                {diseaseInfo.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800">Treatment</h2>
              </div>
              <ul className="space-y-2">
                {diseaseInfo.treatment.map((treatment, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{treatment}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Prevention */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800">Prevention Tips</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {diseaseInfo.prevention.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
              <p className="text-yellow-700 text-sm">
                This AI-powered diagnosis is for informational purposes only and should not replace professional plant pathology advice. 
                For accurate diagnosis and treatment of valuable plants, please consult with local agricultural extension services, 
                plant pathologists, or certified horticulturists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component that wraps the content in Suspense
const DiseasePredictionResult: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DiseasePredictionResultContent />
    </Suspense>
  );
};

export default DiseasePredictionResult;