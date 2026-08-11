/** @param {'en' | 'ar'} locale */
export function getCookiePolicyContent(locale) {
  if (locale === 'ar') {
    return {
      title: 'سياسة ملفات تعريف الارتباط',
      html: `
        <h2>ما هي ملفات تعريف الارتباط؟</h2>
        <p>ملفات تعريف الارتباط هي ملفات نصية صغيرة تُخزَّن على جهازك عند زيارة موقعنا.</p>
        <h2>كيف نستخدمها</h2>
        <ul>
          <li><strong>ضرورية:</strong> لتذكر تفضيلات اللغة والمظهر وتشغيل الموقع.</li>
          <li><strong>تحليلات (اختيارية):</strong> Google Analytics لفهم عدد الزوار وتحسين الموقع — تُفعَّل فقط بعد موافقتك.</li>
        </ul>
        <h2>إدارة تفضيلاتك</h2>
        <p>يمكنك قبول أو رفض ملفات التحليلات من شريط الموافقة عند أول زيارة. لحذف التفضيلات المحفوظة، امسح بيانات الموقع من متصفحك.</p>
        <h2>مزيد من المعلومات</h2>
        <p>راجع أيضاً <a href="/ar/privacy-policy">سياسة الخصوصية</a>.</p>
      `,
    }
  }

  return {
    title: 'Cookie Policy',
    html: `
      <h2>What are cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit our website.</p>
      <h2>How we use them</h2>
      <ul>
        <li><strong>Essential:</strong> remember language/theme preferences and run the site.</li>
        <li><strong>Analytics (optional):</strong> Google Analytics to understand traffic and improve the site — only enabled after you accept.</li>
      </ul>
      <h2>Managing your choice</h2>
      <p>You can accept or reject analytics cookies from the banner on your first visit. To reset your choice, clear site data in your browser.</p>
      <h2>More information</h2>
      <p>See also our <a href="/en/privacy-policy">Privacy Policy</a>.</p>
    `,
  }
}
