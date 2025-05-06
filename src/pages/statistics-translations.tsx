export const translations = {
    en: {
      title: "Health Condition Tracker",
      conditions: {
        diabetes: "Diabetes",
        heart: "Heart disease",
        pressure: "Blood pressure",
        anemia: "Anemia"
      },
      labels: {
        exerciseDuration: "Exercise duration (hours)",
        bloodSugar: "Blood sugar level (mg/dl)",
        weight: "Weight (kg)",
        height: "Height (cm)",
        cholesterol: "Cholesterol level (mg/dl)",
        bloodPressure: "Blood pressure (mmHg)",
        systolic: "Systolic pressure (mmHg)",
        diastolic: "Diastolic pressure (mmHg)",
        hemoglobin: "Hemoglobin level (g/dL)",
        ironLevel: "Iron level (μg/dL)"
      },
      placeholders: {
        enterValue: "Enter value in mg/dl",
        enterWeight: "Enter your weight",
        enterHeight: "Enter your height",
        bloodPressureFormat: "Format: 120/80",
        upperNumber: "Upper number",
        lowerNumber: "Lower number",
        enterCholesterol: "Enter cholesterol level",
        enterHemoglobin: "Enter hemoglobin level",
        enterIronLevel: "Enter iron level"
      },
      status: {
        bmi: "Body Mass Index (BMI)",
        healthy: "You are healthy",
        monitorWeight: "Monitor your weight",
        healthyRange: "Healthy range",
        keepMonitoring: "Keep monitoring",
        bloodSugarStatus: "Blood sugar status",
        cholesterolStatus: "Cholesterol status",
        bloodPressure: "Blood Pressure",
        hemoglobinStatus: "Hemoglobin Status",
        ironLevel: "Iron Level",
        dailyActivity: "Daily Activity",
        recommendations: "Recommendations",
        reduceSodium: "Reduce sodium intake",
        exerciseRegularly: "Exercise regularly",
        enterData: "Enter data",
        monitorRegularly: "Monitor regularly",
        currentHours: "Current: {hours} hours",
        high: "High",
        normal: "Normal",
        low: "Low",
        highRisk: "High Risk",
        moderate: "Moderate",
        elevated: "Elevated"
      },
      healthTrends: "Health Trends",
      monthlyTrend: "Monthly Trend",
      weeklyActivity: "Weekly Activity"
    },
    ar: {
      title: "متتبع الحالات الصحية",
      conditions: {
        diabetes: "السكري",
        heart: "أمراض القلب",
        pressure: "ضغط الدم",
        anemia: "فقر الدم"
      },
      labels: {
        exerciseDuration: "مدة التمارين (ساعات)",
        bloodSugar: "مستوى السكر في الدم (ملغم/ديسيلتر)",
        weight: "الوزن (كجم)",
        height: "الطول (سم)",
        cholesterol: "مستوى الكوليسترول (ملغم/ديسيلتر)",
        bloodPressure: "ضغط الدم (ملم زئبق)",
        systolic: "الضغط الانقباضي (ملم زئبق)",
        diastolic: "الضغط الانبساطي (ملم زئبق)",
        hemoglobin: "مستوى الهيموجلوبين (غم/ديسيلتر)",
        ironLevel: "مستوى الحديد (ميكروغرام/ديسيلتر)"
      },
      placeholders: {
        enterValue: "أدخل القيمة بوحدة ملغم/ديسيلتر",
        enterWeight: "أدخل وزنك",
        enterHeight: "أدخل طولك",
        bloodPressureFormat: "الصيغة: 120/80",
        upperNumber: "الرقم العلوي",
        lowerNumber: "الرقم السفلي",
        enterCholesterol: "أدخل مستوى الكوليسترول",
        enterHemoglobin: "أدخل مستوى الهيموجلوبين",
        enterIronLevel: "أدخل مستوى الحديد"
      },
      status: {
        bmi: "مؤشر كتلة الجسم",
        healthy: "أنت بصحة جيدة",
        monitorWeight: "راقب وزنك",
        healthyRange: "النطاق الصحي",
        keepMonitoring: "استمر في المراقبة",
        bloodSugarStatus: "حالة السكر في الدم",
        cholesterolStatus: "حالة الكوليسترول",
        bloodPressure: "ضغط الدم",
        hemoglobinStatus: "حالة الهيموجلوبين",
        ironLevel: "مستوى الحديد",
        dailyActivity: "النشاط اليومي",
        recommendations: "التوصيات",
        reduceSodium: "قلل من تناول الصوديوم",
        exerciseRegularly: "تمرن بانتظام",
        enterData: "أدخل البيانات",
        monitorRegularly: "راقب بانتظام",
        currentHours: "الحالي: {hours} ساعات",
        high: "مرتفع",
        normal: "طبيعي",
        low: "منخفض",
        highRisk: "خطر مرتفع",
        moderate: "معتدل",
        elevated: "مرتفع قليلاً"
      },
      healthTrends: "الاتجاهات الصحية",
      monthlyTrend: "الاتجاه الشهري",
      weeklyActivity: "النشاط الأسبوعي"
    }
  };
  
  export type Language = keyof typeof translations;