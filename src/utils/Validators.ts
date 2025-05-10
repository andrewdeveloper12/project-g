// Validation utility functions for health statistics forms

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// First version of validation functions
export const validateDiabetesForm = (formData: { 
  exerciseDuration: string; 
  bloodSugar: string; 
  weight: string; 
  height: string; 
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate exerciseDuration
  if (!formData.exerciseDuration || parseFloat(formData.exerciseDuration) <= 0) {
    errors.exerciseDuration = 'formErrors.invalidExerciseDuration';
  }
  
  // Validate bloodSugar
  if (!formData.bloodSugar || isNaN(parseFloat(formData.bloodSugar)) || parseFloat(formData.bloodSugar) <= 0) {
    errors.bloodSugar = 'formErrors.invalidBloodSugar';
  }
  
  // Validate weight
  if (!formData.weight || isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) <= 0) {
    errors.weight = 'formErrors.invalidWeight';
  }
  
  // Validate height
  if (!formData.height || isNaN(parseFloat(formData.height)) || parseFloat(formData.height) <= 0) {
    errors.height = 'formErrors.invalidHeight';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateHeartForm = (formData: { 
  cholesterol: string; 
  bloodPressure: string; 
  weight: string; 
  height: string; 
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate cholesterol
  if (!formData.cholesterol || isNaN(parseFloat(formData.cholesterol)) || parseFloat(formData.cholesterol) <= 0) {
    errors.cholesterol = 'formErrors.invalidCholesterol';
  }
  
  // Validate bloodPressure
  if (!formData.bloodPressure) {
    errors.bloodPressure = 'formErrors.invalidBloodPressure';
  }
  
  // Validate weight
  if (!formData.weight || isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) <= 0) {
    errors.weight = 'formErrors.invalidWeight';
  }
  
  // Validate height
  if (!formData.height || isNaN(parseFloat(formData.height)) || parseFloat(formData.height) <= 0) {
    errors.height = 'formErrors.invalidHeight';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePressureForm = (formData: { 
  systolic: string; 
  diastolic: string; 
  weight: string; 
  height: string; 
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate systolic
  if (!formData.systolic || isNaN(parseFloat(formData.systolic)) || parseFloat(formData.systolic) <= 0) {
    errors.systolic = 'formErrors.invalidSystolic';
  }
  
  // Validate diastolic
  if (!formData.diastolic || isNaN(parseFloat(formData.diastolic)) || parseFloat(formData.diastolic) <= 0) {
    errors.diastolic = 'formErrors.invalidDiastolic';
  }
  
  // Validate weight
  if (!formData.weight || isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) <= 0) {
    errors.weight = 'formErrors.invalidWeight';
  }
  
  // Validate height
  if (!formData.height || isNaN(parseFloat(formData.height)) || parseFloat(formData.height) <= 0) {
    errors.height = 'formErrors.invalidHeight';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAnemiaForm = (formData: { 
  hemoglobin: string; 
  ironLevel: string; 
  weight: string; 
  height: string; 
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate hemoglobin
  if (!formData.hemoglobin || isNaN(parseFloat(formData.hemoglobin)) || parseFloat(formData.hemoglobin) <= 0) {
    errors.hemoglobin = 'formErrors.invalidHemoglobin';
  }
  
  // Validate weight
  if (!formData.weight || isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) <= 0) {
    errors.weight = 'formErrors.invalidWeight';
  }
  
  // Validate height
  if (!formData.height || isNaN(parseFloat(formData.height)) || parseFloat(formData.height) <= 0) {
    errors.height = 'formErrors.invalidHeight';
  }
  
  // We don't validate ironLevel as it's optional
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Second version of validation functions with isNumeric utility
export const isNumeric = (value: string): boolean => {
  if (typeof value !== 'string') return false;
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

export const validateDiabetesFormV2 = (data: {
  exerciseDuration: string;
  bloodSugar: string;
  weight: string;
  height: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.exerciseDuration) {
    errors.exerciseDuration = 'validationErrors.exerciseRequired';
  }
  
  if (!data.bloodSugar) {
    errors.bloodSugar = 'validationErrors.bloodSugarRequired';
  } else if (!isNumeric(data.bloodSugar)) {
    errors.bloodSugar = 'validationErrors.bloodSugarInvalid';
  }
  
  if (!data.weight) {
    errors.weight = 'validationErrors.weightRequired';
  } else if (!isNumeric(data.weight)) {
    errors.weight = 'validationErrors.weightInvalid';
  }
  
  if (!data.height) {
    errors.height = 'validationErrors.heightRequired';
  } else if (!isNumeric(data.height)) {
    errors.height = 'validationErrors.heightInvalid';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateHeartFormV2 = (data: {
  cholesterol: string;
  bloodPressure: string;
  weight: string;
  height: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.cholesterol) {
    errors.cholesterol = 'validationErrors.cholesterolRequired';
  } else if (!isNumeric(data.cholesterol)) {
    errors.cholesterol = 'validationErrors.cholesterolInvalid';
  }
  
  if (!data.bloodPressure) {
    errors.bloodPressure = 'validationErrors.bloodPressureRequired';
  }
  
  if (!data.weight) {
    errors.weight = 'validationErrors.weightRequired';
  } else if (!isNumeric(data.weight)) {
    errors.weight = 'validationErrors.weightInvalid';
  }
  
  if (!data.height) {
    errors.height = 'validationErrors.heightRequired';
  } else if (!isNumeric(data.height)) {
    errors.height = 'validationErrors.heightInvalid';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePressureFormV2 = (data: {
  systolic: string;
  diastolic: string;
  weight: string;
  height: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.systolic) {
    errors.systolic = 'validationErrors.systolicRequired';
  } else if (!isNumeric(data.systolic)) {
    errors.systolic = 'validationErrors.systolicInvalid';
  }
  
  if (!data.diastolic) {
    errors.diastolic = 'validationErrors.diastolicRequired';
  } else if (!isNumeric(data.diastolic)) {
    errors.diastolic = 'validationErrors.diastolicInvalid';
  }
  
  if (!data.weight) {
    errors.weight = 'validationErrors.weightRequired';
  } else if (!isNumeric(data.weight)) {
    errors.weight = 'validationErrors.weightInvalid';
  }
  
  if (!data.height) {
    errors.height = 'validationErrors.heightRequired';
  } else if (!isNumeric(data.height)) {
    errors.height = 'validationErrors.heightInvalid';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAnemiaFormV2 = (data: {
  hemoglobin: string;
  ironLevel: string;
  weight: string;
  height: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.hemoglobin) {
    errors.hemoglobin = 'validationErrors.hemoglobinRequired';
  } else if (!isNumeric(data.hemoglobin)) {
    errors.hemoglobin = 'validationErrors.hemoglobinInvalid';
  }
  
  if (!data.weight) {
    errors.weight = 'validationErrors.weightRequired';
  } else if (!isNumeric(data.weight)) {
    errors.weight = 'validationErrors.weightInvalid';
  }
  
  if (!data.height) {
    errors.height = 'validationErrors.heightRequired';
  } else if (!isNumeric(data.height)) {
    errors.height = 'validationErrors.heightInvalid';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};