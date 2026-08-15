/** @param {'en' | 'ar'} locale */
export function getAccessibilityStatementContent(locale) {
  if (locale === 'ar') {
    return {
      title: 'بيان إمكانية الوصول',
      html: `
        <p>تلتزم مجموعة مفاتيح بتوفير موقع إلكتروني يمكن استخدامه من أكبر عدد ممكن من الزوار، بما في ذلك الأشخاص ذوو الإعاقة.</p>
        <h2>ما نوفره</h2>
        <ul>
          <li>دعم اللغة العربية والإنجليزية مع اتجاه النص المناسب (من اليمين لليسار / من اليسار لليمين).</li>
          <li>عناوين وروابط واضحة، وتسميات للأزرار والنماذج.</li>
          <li>دعم تفضيل تقليل الحركة في المتصفح.</li>
          <li>إمكانية التنقل بلوحة المفاتيح على الروابط والأزرار الرئيسية.</li>
        </ul>
        <h2>حدود معروفة</h2>
        <p>الموقع تطبيق React يعمل من جهة المتصفح. لذلك قد تعتمد بعض أدوات الفحص الآلي على المحتوى بعد تحميل الصفحة. نراجع إمكانية الوصول عبر أدوات مثل Lighthouse بعد كل إصدار مهم.</p>
        <h2>التواصل</h2>
        <p>إذا واجهتم صعوبة في استخدام الموقع، تواصلوا معنا عبر <a href="/ar/contact">صفحة الاتصال</a> أو البريد الإلكتروني <a href="mailto:info@mafateehgroup.com">info@mafateehgroup.com</a>.</p>
      `,
    }
  }

  return {
    title: 'Accessibility Statement',
    html: `
      <p>Mafateeh Group is committed to making this website usable by as many visitors as possible, including people with disabilities.</p>
      <h2>What we provide</h2>
      <ul>
        <li>English and Arabic language support with the correct text direction (LTR/RTL).</li>
        <li>Clear headings, links, and labels on buttons and forms.</li>
        <li>Support for reduced-motion browser preferences.</li>
        <li>Keyboard access for primary links and buttons.</li>
      </ul>
      <h2>Known limitations</h2>
      <p>This website is a React application. Some automated checkers only see content after the page has loaded. We review accessibility with tools such as Lighthouse after major releases.</p>
      <h2>Contact</h2>
      <p>If you have trouble using the site, contact us via the <a href="/en/contact">Contact page</a> or email <a href="mailto:info@mafateehgroup.com">info@mafateehgroup.com</a>.</p>
    `,
  }
}
