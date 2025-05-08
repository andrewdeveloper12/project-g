export const isNumeric = (value: string): boolean => {
    if (typeof value !== 'string') return false;
    return !isNaN(parseFloat(value)) && isFinite(Number(value));
  };
  
  export const validateDiabetesForm = (data: {
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
  
  export const validateHeartForm = (data: {
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
  
  export const validatePressureForm = (data: {
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
  
  export const validateAnemiaForm = (data: {
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