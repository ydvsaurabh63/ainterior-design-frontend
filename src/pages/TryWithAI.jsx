import React from 'react';
import AIInteriorDesigner from './AIInteriorDesigner';

/**
 * TryWithAI component alias routing to AIInteriorDesigner
 * Ensures existing links to /try-with-ai load the complete AI Interior Designer feature seamlessly
 */
const TryWithAI = () => {
  return <AIInteriorDesigner />;
};

export default TryWithAI;
