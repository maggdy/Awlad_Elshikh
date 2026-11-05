/*
  عدّل بيانات المطعم والأصناف من هنا.
  رقم واتساب: كود مصر 20 ثم الرقم بدون الصفر الأول.
  مثال: 01012345678 يصبح 201012345678
*/
window.MENU_DATA = {
  restaurantName: "مطعم الذوق",
  tagline: "طعم تحبه.. وتجربة تستاهلها",
  whatsappNumber: "201141260337", // استبدل X برقم واتساب المطعم
  currency: "ج.م",
  categories: ["الكل", "الأكثر طلبًا", "وجبات رئيسية", "مقبلات", "مشروبات"],
  items: [
    {
      id: 1, name: "برجر كلاسيك", category: "الأكثر طلبًا",
      description: "قطعة لحم مشوية، جبنة شيدر، خس وصوص المطعم.",
      price: 145,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: 2, name: "بيتزا خضار", category: "وجبات رئيسية",
      description: "موتزاريلا، فلفل ألوان، زيتون ومشروم.",
      price: 180,
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: 3, name: "باستا وايت صوص", category: "وجبات رئيسية",
      description: "مكرونة بصوص كريمي خفيف وقطع الدجاج.",
      price: 155,
      image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: 4, name: "بطاطس كرسبي", category: "مقبلات",
      description: "بطاطس ذهبية مقرمشة مع صوص جانبي.",
      price: 65,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: 5, name: "سلطة طازجة", category: "مقبلات",
      description: "خضروات طازجة وتتبيلة خاصة.",
      price: 55,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: 6, name: "ليمون بالنعناع", category: "مشروبات",
      description: "ليمون طازج ونعناع منعش.",
      price: 45,
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85"
    }
  ]
};
