import React from "react";

export default function Link({ goBack }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">🎉 UCAT Access Granted!</h1>
        <p className="mb-4">
          You now have access to your UCAT preparatory materials and quizzes.  
          Click the link below to start practicing:
        </p>
        <a
          href="https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/QB_VR"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg font-semibold mb-6"
        >
          Verbal Reasoning Preparatory Test
        </a>
        <p><a
          href="https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/QB_DM"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg font-semibold mb-6"
        >
          Decision Making Preparatory Test
        </a></p>
        <p><a
          href="https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/QB_QR"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg font-semibold mb-6"
        >
          Quantitave Reasoning Preparatory Test
        </a></p>
<p><a
          href="https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/QB_SJT"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg font-semibold mb-6"
        >
          Situational Judgement Preparatory Test
        </a></p>
        <p className="mb-4 text-sm">
          If you encounter any issues, contact us for support.
        </p>

        <button
          onClick={goBack}
          className="mt-2 w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
