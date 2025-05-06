import { useState } from 'react';
import { SendHorizonal, Trash2 } from 'lucide-react';

const faqAnswers: Record<string, string> = {
  // Greetings
  "hi": "مرحباً! كيف يمكنني مساعدتك اليوم؟ | Hello! How can I help you today?",
  "hello": "مرحباً! كيف يمكنني مساعدتك اليوم؟ | Hello! How can I help you today?",
  "مرحباً": "مرحباً! كيف يمكنني مساعدتك اليوم؟ | Hello! How can I help you today?",
  "أهلاً": "أهلاً وسهلاً! كيف يمكنني مساعدتك؟ | Welcome! How can I assist you?",
  "how are you": "أنا بخير، شكراً لك! كيف يمكنني مساعدتك؟ | I'm fine, thank you! How can I help you?",
  "اخبارك ايه": "أنا بخير، شكراً لك! كيف يمكنني مساعدتك؟ | I'm fine, thank you! How can I help you?",
  "how's it going": "كل شيء على ما يرام! كيف يمكنني مساعدتك اليوم؟ | Everything is good! How can I help you today?",
  "عامل ايه": "كل شيء على ما يرام! كيف يمكنني مساعدتك اليوم؟ | Everything is good! How can I help you today?",
  "how are you today": "اليوم ممتاز! هل لديك أي أسئلة؟ | Today is great! Do you have any questions?",
  "إزيك النهاردة": "اليوم ممتاز! هل لديك أي أسئلة؟ | Today is great! Do you have any questions?",

  // Diabetes
  "what is diabetes?": "السكري هو مرض مزمن يحدث عندما يعجز الجسم عن إنتاج الإنسولين بكمية كافية أو استخدامه بشكل فعال. | Diabetes is a chronic condition where the body cannot produce enough insulin or use it effectively.",
  "ما هو مرض السكري؟": "السكري هو مرض مزمن يحدث عندما يعجز الجسم عن إنتاج الإنسولين بكمية كافية أو استخدامه بشكل فعال. | Diabetes is a chronic condition where the body cannot produce enough insulin or use it effectively.",
  "what are the symptoms of diabetes?": "العطش الشديد، التبول المتكرر، التعب، عدم وضوح الرؤية، وفقدان الوزن غير المبرر. | Intense thirst, frequent urination, fatigue, blurred vision, and unexplained weight loss.",
  "ما هي أعراض السكري؟": "العطش الشديد، التبول المتكرر، التعب، عدم وضوح الرؤية، وفقدان الوزن غير المبرر. | Intense thirst, frequent urination, fatigue, blurred vision, and unexplained weight loss.",
  "what is the normal blood sugar level?": "صائم: أقل من 100 مجم/دسل، بعد الأكل بساعتين: أقل من 140 مجم/دسل. | Fasting: less than 100 mg/dL, 2 hours after eating: less than 140 mg/dL.",
  "ما هو المعدل الطبيعي للسكر؟": "صائم: أقل من 100 مجم/دسل، بعد الأكل بساعتين: أقل من 140 مجم/دسل. | Fasting: less than 100 mg/dL, 2 hours after eating: less than 140 mg/dL.",
  "can diabetes be cured?": "النوع الثاني يمكن السيطرة عليه وقد يدخل في حالة خمول تام عبر النظام الغذائي والرياضة وخسارة الوزن. | Type 2 can be controlled and even go into remission with diet, exercise, and weight loss.",
  "هل يمكن الشفاء من السكري؟": "النوع الثاني يمكن السيطرة عليه وقد يدخل في حالة خمول تام عبر النظام الغذائي والرياضة وخسارة الوزن. | Type 2 can be controlled and even go into remission with diet, exercise, and weight loss.",

  // Heart disease
  "what is heart disease?": "مرض القلب يشمل مجموعة من الحالات التي تؤثر على القلب، مثل أمراض الشرايين التاجية أو فشل القلب. | Heart disease includes a range of conditions that affect the heart, such as coronary artery disease or heart failure.",
  "ما هو مرض القلب؟": "مرض القلب يشمل مجموعة من الحالات التي تؤثر على القلب، مثل أمراض الشرايين التاجية أو فشل القلب. | Heart disease includes a range of conditions that affect the heart, such as coronary artery disease or heart failure.",
  "what are the symptoms of heart disease?": "ألم في الصدر، ضيق في التنفس، تعب غير مبرر، وتورم في الساقين. | Chest pain, shortness of breath, unexplained fatigue, and swelling in the legs.",
  "ما هي أعراض مرض القلب؟": "ألم في الصدر، ضيق في التنفس، تعب غير مبرر، وتورم في الساقين. | Chest pain, shortness of breath, unexplained fatigue, and swelling in the legs.",
  "how can heart disease be prevented?": "تناول طعام صحي، ممارسة الرياضة بانتظام، والابتعاد عن التدخين. | Eating healthy, exercising regularly, and avoiding smoking.",
  "كيف يمكن الوقاية من مرض القلب؟": "تناول طعام صحي، ممارسة الرياضة بانتظام، والابتعاد عن التدخين. | Eating healthy, exercising regularly, and avoiding smoking.",
  "what advice can you give me about heart disease?": `Limit Sodium: Too much salt can raise blood pressure, a big risk for heart disease.
Aim for less than 2,300 mg/day—I can check sodium levels when you scan a product.
Cut Saturated Fats: These can clog arteries. Look for products with less than 5% saturated fat per serving.
Watch Cholesterol: Foods high in cholesterol (like some meats or dairy) can worsen heart health—scan labels to spot them.
Eat More Fiber: Fruits, veggies, and whole grains help your heart.
Stay Active: Even 30 minutes of walking most days can make a difference.`,

  // Blood pressure
  "what is blood pressure?": "ضغط الدم هو القوة التي يمارسها الدم على جدران الأوعية الدموية. | Blood pressure is the force exerted by the blood on the walls of the blood vessels.",
  "ما هو ضغط الدم؟": "ضغط الدم هو القوة التي يمارسها الدم على جدران الأوعية الدموية. | Blood pressure is the force exerted by the blood on the walls of the blood vessels.",
  "what is the normal blood pressure level?": "أقل من 120/80 مم زئبقي. | Less than 120/80 mmHg.",
  "ما هو المعدل الطبيعي لضغط الدم؟": "أقل من 120/80 مم زئبقي. | Less than 120/80 mmHg.",
  "what are the symptoms of high blood pressure?": "صداع، دوار، ضيق في التنفس، وألم في الصدر. | Headache, dizziness, shortness of breath, and chest pain.",
  "ما هي أعراض ارتفاع ضغط الدم؟": "صداع، دوار، ضيق في التنفس، وألم في الصدر. | Headache, dizziness, shortness of breath, and chest pain.",
  "how can high blood pressure be treated?": "من خلال تغييرات نمط الحياة، تناول الأدوية الموصوفة، والابتعاد عن التوتر. | Through lifestyle changes, prescribed medications, and managing stress.",
  "كيف يمكن علاج ارتفاع ضغط الدم؟": "من خلال تغييرات نمط الحياة، تناول الأدوية الموصوفة، والابتعاد عن التوتر. | Through lifestyle changes, prescribed medications, and managing stress.",

  // Anemia
  "what is anemia?": "الأنيميا هي نقص في عدد خلايا الدم الحمراء أو الهيموغلوبين في الدم. | Anemia is a deficiency in the number of red blood cells or hemoglobin in the blood.",
  "ما هي الأنيميا؟": "الأنيميا هي نقص في عدد خلايا الدم الحمراء أو الهيموغلوبين في الدم. | Anemia is a deficiency in the number of red blood cells or hemoglobin in the blood.",
  "what are the symptoms of anemia?": "الشعور بالتعب الشديد، شحوب الجلد، وضيق التنفس. | Extreme fatigue, pale skin, and shortness of breath.",
  "ما هي أعراض الأنيميا؟": "الشعور بالتعب الشديد، شحوب الجلد، وضيق التنفس. | Extreme fatigue, pale skin, and shortness of breath.",
  "how can anemia be treated?": "من خلال تناول مكملات الحديد أو تغيير النظام الغذائي لزيادة الحديد. | Through iron supplements or dietary changes to increase iron intake.",
  "كيف يمكن علاج الأنيميا؟": "من خلال تناول مكملات الحديد أو تغيير النظام الغذائي لزيادة الحديد. | Through iron supplements or dietary changes to increase iron intake.",

  // Survey
  "i want to take a survey": "Please answer a few questions in this survey:\nhttp://dfgyhbjj.jhuygfrtd.hgvbhmn",
  "أريد إجراء استطلاع": "يرجى الإجابة على بعض الأسئلة في هذا الاستطلاع:\nhttp://dfgyhbjj.jhuygfrtd.hgvbhmn"
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];

    const reply = faqAnswers[input.toLowerCase()] || "Sorry, I couldn't find an answer to your question.";
    const botMessage = { sender: 'bot', text: reply };

    setMessages([...newMessages, botMessage]);
    setInput('');
  };

  const clearChat = () => {
    setMessages([{ sender: 'bot', text: 'Hi there! How can I help you today?' }]);
    setInput('');
  };

  return (
    <div className="flex flex-col items-center pb-12 justify-center h-screen bg-green">
      <div className="w-full max-w-[1000px] bg-white shadow-lg rounded-t-3xl flex flex-col overflow-hidden h-[75vh]">
        {/* Chat header */}
        <div className="bg-[#21BA3B] text-white p-2 text-center">
          <h1 className="text-l font-semibold text-white">Health Assistant</h1>
        </div>
        
        {/* Chat messages */}
        <div className="p-4 overflow-y-auto flex-1" style={{ height: 'calc(100% - 80px)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-[#DEF5E2] text-black rounded-tr-none'
                    : 'bg-[#E9F5F5] text-gray-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line text-sm">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-white-600 px-4 py-4 bg-white">
          <div className="flex items-center gap-2 ">
            <button
              onClick={clearChat}
              className="text-[#2D7D7D] hover:text-[#FAFAFA] p-2 rounded-full"
              title="Clear Chat"
            >
              <Trash2 size={25} />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex border border-21BA3B-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#21BA3B] text-sm h-20vh shadow-15"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-[#21BA3B] hover:bg-[#21BA3B] text-white p-2 rounded-full transition"
              title="Send"
            >
              <SendHorizonal size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;