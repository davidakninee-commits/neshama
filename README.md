# נשמה

אתר PWA בעברית, אופליין-first, לסריקה בקוד QR בבתי עלמין. המבקר מקליד את שם
הנפטר ומקבל את פרקי תהילים קי"ט לפי אותיות השם (וסיום נ-ש-מ-ה), תהילים מלא,
ששה סדרי משנה, וסדר ההזכרה/השכבה (ספרדי/אשכנזי, זכר/נקבה).

ראו את תוכנית הפיתוח המלאה ב-`.claude/plans/humble-stirring-canyon.md` (אם
קיים אצלכם) או בהיסטוריית השיחה שהולידה את הפרויקט.

## ⚠️ תוכן הדורש אישור הלכתי לפני שימוש בפועל

שני חלקים בפרויקט נשלחים עם **תוכן זמני/טיוטה** בלבד, ומסומנים בקוד
(`isPlaceholder`/הערות `NOT FINAL`):

- **משניות לפי אותיות השם** (`src/lib/mishnahByName/defaultMapping.ts`) — לא
  נמצא מקור הלכתי מוסכם יחיד למיפוי אות→משנה; כל רשומה מצביעה על משנה אמיתית
  וקיימת, אך ההתאמה לאות עצמה היא טיוטה בלבד.
- **נוסח ההזכרה/השכבה** (`src/lib/hazkara/templates.ts`) — מבנה התבנית (סלוטים,
  התאמות מגדר) סופי ונבדק, אך הנוסח המילולי המדויק טרם נבדק מול סידור מודפס
  או רב.

**אין לפרסם את האתר בפועל לפני שמישהו יבדוק את שני הסעיפים הללו.**

## פיתוח

```sh
npm install
npm run dev       # http://localhost:4321
npm run build      # build ל-dist/
npm run preview
```

## מקורות הטקסט

תהילים ומשניות מגיעים מ-[Sefaria-Export](https://github.com/Sefaria/Sefaria-Export)
(נוסחים ציבוריים/Public Domain — ראו `data/content/SOURCES.md` לאחר הרצת
`npm run ingest`).

## סטאק טכני

Astro (static output) · TypeScript · vite-plugin-pwa (Workbox) · Taamey Frank
CLM / Noto Serif Hebrew / Heebo / Frank Ruhl Libre (כל הפונטים ברישיון פתוח,
self-hosted) · ללא שרת, ללא מסד נתונים, ללא אנליטיקס/cookies.
