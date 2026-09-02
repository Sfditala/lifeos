# CLAUDE.md — تعليمات دائمة لهذا المشروع

هذا الملف يُقرأ تلقائيًا من Claude Code في بداية كل جلسة داخل هذا المجلد. اقرأه بالكامل قبل أي عمل — وخصوصًا قسم **"التقدّم الحالي"** (لتعرف وين وصلت آخر مرة) وقسم **"قواعد صارمة"** (لا تُكسر مهما حصل).

المشروع: نظام تشغيل شخصي ومهني واحد (Personal Life & Business OS) — يدير الأهداف والمشاريع والمهام والعادات والمحتوى والمعرفة والمال والملفات والاجتماعات والعلاقات بين الكيانات، بمساحة عمل شخصية ومساحة عمل فريق حقيقية معًا، في مكان واحد بدل أدوات متفرقة.

**نطاق هذا الملف (مُحدَّث):** بناء طبقات البيانات والواجهات **بالكامل** (شخصي + فريق/شركة حقيقي + مال + علاقات بين الكيانات + ملفات) — **بدون أي طبقة ذكاء اصطناعي فعلية إطلاقًا** (بدون استدعاء Anthropic/Claude API، بدون توليد أو اقتراحات آلية، بدون تحليل محادثات بالذكاء الاصطناعي). كل شيء غير ذلك — بيانات، واجهات، تعاون بين مستخدمين حقيقيين، مال، ملفات — داخل نطاق هذا الملف.

📎 **اقرأ أيضًا `design.md` في نفس المجلد قبل بناء أي صفحة أو مكوّن** — يحدّد اللغة/الاتجاه (عربي/إنجليزي، RTL/LTR)، الوضع الداكن الافتراضي، الخطوط، نظام الألوان، وأنماط المكوّنات الموحّدة. أي قرار بصري غير مذكور هناك → اسأل المستخدم، لا تخترع.

📎 **اقرأ أيضًا `VISION.md` في نفس المجلد للفهم الكامل للفكرة بكل مراحلها.** هذا الملف (CLAUDE.md) يُنفّذ الآن معظم طبقات VISION.md عدا الذكاء الاصطناعي الفعلي وصفحة "الرؤية السنوية" الجمالية — التفاصيل بقسم "قواعد صارمة" أدناه.

---

## 📍 التقدّم الحالي (حدّث هذا السطر بنفسك بعد كل إنجاز، قبل أي شيء آخر)

**Step 0 – Step 18 منجزة (v2.0-full-data-layer-done). الآن ببناء توسّع Steps 19-22 المتفق عليه مع المستخدمة (هرمية أهداف، رسوم بيانية، شركة احترافية، تحسينات صغيرة) — خطوة خطوة بموافقة صريحة بينهم، رجعنا لنمط التوقف الطبيعي بعد كل خطوة.**
**الخطوة الحالية: v2.1 منجزة ومنشورة، وبعدها صفحة تفاصيل لكل هدف + إعادة تصميم العادات + لوحة Kanban للمهام + تحميل بيانات خطة أيلول 2026 الحقيقية + خارطة توسيع نظام إدارة الشركة (5 مراحل) — المراحل 1-2-3-4 منجزة ومنشورة، بانتظار "كمل" صريح من المستخدمة للانتقال للمرحلة 5 الأخيرة (تفصيل كامل تحت).**
**v2.1 — رفع التصميم البصري (design.md مُحدَّث فعليًا، مو مجرد نية):** المستخدمة طلبت "احترافي جدًا، منظم، بألوان وحيوية أكثر" — بنيت معاينة تفاعلية (Artifact) تقارن الحالي بالمقترح، وافقت عليها، ثم طُبِّقت فعليًا: لون تمييز حقيقي (`--primary` coral-amber) يقود كل الأزرار وحلقات التركيز بالنظام كله بدل الرمادي البحت، ظلال (`shadow-sm`→`shadow-md` بالـhover) على كل بطاقات/حاويات القوائم (~24 موضع بكل الصفحات مو بس عينة)، توهج شعاعي خلف قسم تقدم الأهداف الكبير بالصفحة الرئيسية، وبطاقات مجالات حياة جديدة بالصفحة الرئيسية (أيقونة ملوّنة + توهج + عدد مشاريع نشطة/مهام متأخرة حقيقية) — مدخل تنقّل جديد ما كان موجود أصلاً. `design.md` نفسه مُحدَّث بقسم "نظام الألوان" الجديد ليعكس هذا كتوثيق رسمي دائم، مو تغيير طارئ غير موثّق.
**v2.1 — صفحة إعدادات شخصية (`/settings`):** اسم معروض + لون تمييز شخصي قابل للاختيار (يطغى على اللون الافتراضي عبر CSS variable بالـlayout) + إدارة مركزية لمجالات الحياة (تعديل/حذف). جدول جديد `user_settings` بنفس نمط RLS الشخصي المعتاد بالمشروع (مو `auth.users.user_metadata`).
**v2.1 — شات الشركة:** تحوّل من قسم دائم يشغل مساحة بصفحة المشروع لنافذة منبثقة جانبية (Sheet) تُفتح بزر بجانب عنوان المشروع، بشارة عدد الرسائل — نفس منطق فتح-من-جهة-حسب-اللغة (RTL) المستخدم أصلاً بـMobileNav.
**تنظيف نهائي حقيقي — تم:** بعد معاينة المستخدمة للبيانات التجريبية المزيفة، طلبت صراحة التنظيف الحقيقي. حساب `safaditalaworksp@gmail.com` (8f59079c...) صار فاضي بالكامل من كل جدول (تحقّق عبر استعلام). الحسابين الآخرين (`mohammedsaadaang@gmail.com` بياناته الخاصة، و`talamfsafadi@gmail.com` فاضي أصلاً) **لم يُلمَسا إطلاقًا** بناءً على تعليمات المستخدمة الصريحة — مو من مسؤولية هذا الحساب.
تفاصيل Step 22: عمود `duration_minutes` على `tasks` (شارة "1س 30د" بقوائم المهام). عمود `source` على `transactions` بقائمة مصادر دخل ثابتة (راتب/عمل حر/دخل تجاري/استثمار/هدية/استرداد/أخرى) — يظهر بدل حقل التصنيف الحر فقط لما تكون الحركة دخل، المصروفات تبقى تصنيف نص حر متوافق مع رسم Step 20.
**⚠️ ملاحظة مهمة لأي جلسة لاحقة:** بعد Step 22 مباشرة، بطلب صريح من المستخدمة، تم مسح كل بيانات الحساب الحقيقي بالكامل وتعبئته ببيانات **تجريبية مزيفة بالكامل** (مجالات، أهداف هرمية، مشاريع، مهام، عادات، مال، شركة تجريبية...) لغرض وحيد: معاينة شكل الداشبورد الممتلئ بصريًا. **هذه ليست بيانات حقيقية ولا بيانات اختبار قديمة — لا تُبنى عليها أي قرارات معمارية أو افتراضات عن حياة المستخدمة الفعلية.** التنظيف النهائي الحقيقي (تفريغ الحساب بالكامل ليبدأ الاستخدام الفعلي) **لسا ما صار** — بانتظار طلب صريح لاحق من المستخدمة بعد ما تنتهي من المعاينة.
تفاصيل Step 19: عمود `period_type` + `parent_goal_id` (هرمية إلزامية بترتيب طبقات ثابت يمنع الحلقات الدائرية هيكليًا) + `period_start`/`period_end` (للأسبوعي فقط) على جدول `goals`. التقدم يُحسب تصاعديًا: هدف له أهداف تابعة = متوسط تقدمهم، هدف طرفي مربوط بمجال حياة = نسبة إنجاز مهام ذلك المجال فعليًا (بيانات حقيقية من العلاقة، مو رقم يدوي)، وإلا حسب حالته. الصفحة الرئيسية صارت: الهدف الكبير، أهداف السنة، أهداف الشهر، أهداف الأسبوع (بتتجدد تلقائيًا حسب الأسبوع الحالي + رابط لبدء مراجعة أسبوعية)، وتحتها الأقسام التشغيلية القديمة (مهام اليوم، متأخرة، اجتماعات، تذكير مالي).
تفاصيل Step 20: مكتبة recharts + 3 مكوّنات رسم بياني موحّدة (Donut/HorizontalBar/MonthlyFlow) مُعاد استخدامها بكل مكان بدل حلول منفصلة: نظرة عامة بالمال (توزيع المصروفات حسب التصنيف + دخل/مصروف آخر 6 أشهر)، نظرة عامة بالأهداف بالصفحة الرئيسية (تقدم الهدف الكبير + السنوي)، نظرة عامة بكل مجال حياة (توزيع المهام حسب الحالة + نسبة إنجاز كل مشروع)، وصفحة المشروع (نسبة إنجاز مهامه — هاي تخدم أي حالة "مشروع = وحدة تتبع" زي مادة جامعية بدون أي تعديل إضافي).
**قبل Step 21 مباشرة:** أصلحنا ثغرة تجربة استخدام حقيقية — ربط مشروع بشركة كان يحتاج خطوتين منفصلتين (إنشاء ثم تعديل). صار اختيار الشركة متاح مباشرة عند إنشاء المشروع من تبويب المجال، وأُضيف زر "أضف مشروع" مباشر من صفحة الشركة نفسها.
تفاصيل Step 21: تفاصيل شركة إضافية (تاريخ تأسيس، وصف، مجال عمل، إيميل/هاتف تواصل) قابلة للتعديل من صفحة الشركة (owner فقط). عمود `position` على `team_members` بقائمة أدوار وظيفية ثابتة (مدير/محاسب/مطور/مصمم/تسويق/مبيعات/موارد بشرية/دعم/عضو عام) منفصل تمامًا عن `role` (owner/member اللي يتحكم بالصلاحيات) — يُحدَّد وقت الدعوة ويتغيّر لاحقًا من القائمة المنسدلة بجانب كل عضو. عمود `assigned_to` على `tasks` مع تعيين فعلي من صفحة المشروع المشترك لأي عضو نشط بالشركة. **تدقيق RLS ضروري اكتُشف أثناء البناء:** المهام والمعالم الرئيسية بمشروع مشترك ما كانت ظاهرة أصلاً لأعضاء الفريق غير المالك (RLS كانت مقتصرة على المُنشئ فقط رغم إن المشروع نفسه ظاهر لهم) — أُضيفت سياسات `tasks_company_member_select` و`project_milestones_company_member_select`، بالإضافة لـ`tasks_assignee_update` تسمح للعضو المُعيَّن له تحديث مهمته. **حد معروف ومقبول:** هذه الصلاحية على مستوى الصف كامل مو عمود بعينه، يعني العضو المُعيَّن له يقدر يعدّل/يحذف (حذف ناعم) مهمته مو بس يأشّرها منجزة — قرار متسق مع مستوى الثقة المعتمد بباقي النظام مع أعضاء مدعوين، مو ثغرة أمنية عابرة لحدود الشركة.
**تنبيه صادق:** التدقيق البصري لـ design.md عمومًا (كل الخطوات) كان كوديًا وليس عبر متصفح حقيقي — لا تتوفر أداة متصفح لهذه الجلسة. يُنصح بمراجعة بصرية فعلية من المستخدمة.

### خارطة Steps 19-22 (توسّع متفق عليه بعد v2.0، بدون ذكاء اصطناعي)
- [x] **Step 19** — هرمية الأهداف + صفحة رئيسية كصفحة أهداف
- [x] **Step 20** — رسوم بيانية حقيقية بكل الوحدات (مال، أهداف، مجالات، مشاريع) — عبر recharts
- [x] **Step 21** — الشركة الاحترافية: تفاصيل إضافية + أدوار مخصصة + تعيين مهام لأعضاء فريق محددين
- [x] **Step 22** — تحسينات صغيرة: مدة زمنية على المهمة، تصنيف مصادر دخل منظّم بدل نص حر
- [x] **تعبئة بيانات تجريبية مزيفة** — لمعاينة شكل الداشبورد الممتلئ (تفصيل أعلاه) — ليست بيانات حقيقية.
- [x] **تنظيف بيانات نهائي حقيقي** — تم فعليًا، الحساب فاضي بالكامل وجاهز لبيانات حقيقية.

### v2.1 — منجز بالكامل
- [x] **رفع مستوى التصميم البصري** — design.md مُحدَّث، مُطبَّق فعليًا بكل الصفحات.
- [x] **صفحة إعدادات شخصية** — `/settings`: اسم، لون تمييز، إدارة مجالات حياة.
- [x] **إعادة تصميم شات الشركة** — نافذة منبثقة جانبية بدل قسم دائم.

**تنبيه صادق (زي كل خطوة سابقة):** لا تتوفر أداة متصفح لهذه الجلسة — التحقق البصري كودي + معاينة Artifact وافقت عليها المستخدمة قبل التنفيذ، بس التطبيق الفعلي بالموقع الحي لم يُختبر بمتصفح حقيقي من طرفي. يُنصح بمراجعة فعلية من المستخدمة.

### بعد v2.1 — إضافات متفق عليها (كل وحدة بموافقة صريحة قبلها)

- **صفحة تفاصيل مستقلة لكل هدف** (`/goals/[goalId]`) — بدل ما الهدف يكون سطر بس، صار له صفحة فيها التفاصيل والمشاريع/المهام المرتبطة فيه عن طريق مشروع (بموافقة صريحة: "بس عن طريق مشروع").
- **إعادة تصميم العادات**: جدولة أيام أسبوع مخصصة لكل عادة (مو يومي فقط)، تصنيف للعادات، وجدول منفصل للعادات الأسبوعية بنفس الصفحة — بديل عن `frequency` البسيطة القديمة.
- **لوحة مهام Kanban بنمط GitHub Projects** (`components/task-board.tsx`, عبر `@dnd-kit/core`): 5 مراحل (`backlog/ready/in_progress/in_review/done`) بدل الحالات الثلاث القديمة (`todo/doing/done`) — سحب وإفلات فعلي، لوحة مستقلة لكل مشروع مشترك + لوحة على مستوى الشركة كلها. تعديل/حذف المهمة متاح مباشرة من بطاقة اللوحة.
- **تحميل بيانات حقيقية من 3 مستندات وصلت تالفة (mojibake)**: خطة أيلول 2026، نظام الانضباط بـ7 خطوات، خطة الإطلاق التجاري بالخليج (مع محمد كشريك مؤسس حقيقي بالشركة). كل بيانات اتفق عليها صراحة مع المستخدمة قبل الرفع (قاعدة صارمة دائمة: **لا ترفع بيانات من مستندات مشابهة مستقبلًا بدون تأكيد صريح أولًا**، حتى لو بدا الفهم منطقيًا).
- **إعادة تنظيم مجال "الشركة/العمل الخاص"**: تفريق فعلي بين شركة (إدارة موسّعة، فريق حقيقي) وعمل خاص (نظام أبسط) — تفاصيل القرار موثّقة بمحادثة الجلسة، مو هون تفصيليًا لتفادي التكرار.

### خارطة توسيع نظام إدارة الشركة (5 مراحل، بطلب صريح من المستخدمة لرفع المستوى بعد رفض اقتراح أول أبسط)

المستخدمة طلبت صراحة أعلى مستوى إتقان تقني/معماري/بصري/استخدامي ("اكتسح الشغل بمستوى باهر"). الخطة: **مرحلة 1** (مساحة عمل شركة غنية بتبويبات) → **مرحلة 2** (مالية شركة مستقلة عن المالية الشخصية) → **مرحلة 3** (طبقة CRM/صفقات خفيفة فوق لوحة Kanban، تحويل تلقائي لدخل) → **مرحلة 4** (تحليلات فريق) → **مرحلة 5** (تلميع تشغيلي: مبدّل شركات، قائمة onboarding، صلاحيات أدق). تُنفَّذ خطوة خطوة، توقف وطلب "كمل" صريح بين كل مرحلة والي بعدها — **لا تبدأ مرحلة جديدة بدون "كمل" أو تأكيد مباشر**.

- [x] **مرحلة 1** — مساحة عمل شركة بتبويبات غنية (منجزة، منشورة).
- [x] **مرحلة 2** — مالية شركة مستقلة (`company_id` على `transactions`/`financial_goals`/`finance_accounts` ذات الصلة، منجزة، منشورة).
- [x] **مرحلة 3** — طبقة CRM/صفقات (`deals` table مرتبط 1:1 اختياري بـ`tasks`: جهة اتصال، قناة تواصل، قيمة صفقة، آخر تواصل — قابلة للتعديل من زر $ على بطاقة Kanban. عند نقل المهمة لعمود "منجز"، القيمة تُسجَّل تلقائيًا كحركة دخل بمالية الشركة، بحماية `converted_at` تمنع التكرار عند نقل/إرجاع متكرر. مطبّقة على لوحة المشروع الفردي ولوحة الشركة كلها معًا. Migration: `20260830010000_deals_crm.sql`. مُنجزة، مبنية (`pnpm build` نظيف)، ومنشورة على الإنتاج).
- [x] **مرحلة 4** — تحليلات فريق. جدول `activity_log` جديد (RLS عبر `is_active_company_member` الموجودة أصلاً) يسجّل 8 أنواع أحداث منتقاة (إنشاء مشروع/مهمة، إنجاز مهمة، تعيين مهمة، تحويل صفقة، دعوة/انضمام عضو، رفع ملف) من داخل الـserver actions ذات العلاقة — تسجيل "best-effort" ما يوقف العملية الأصلية لو فشل. تبويب "التحليلات" الجديد بصفحة الشركة (`components/company-detail.tsx`) يعرض: توزيع عبء العمل (مهام مفتوحة/منجزة/متأخرة لكل عضو، برسم `HorizontalBarChart` الموجود + جدول تفصيلي)، **معدل تحويل الصفقات** (الاقتراح المطروح بعد المرحلة 3: عدد الصفقات، نسبة التحويل، قيمة الصفقات المفتوحة مقابل المحقَّقة — كله محسوب مباشرة من `deals.converted_at` بدون جدول إضافي)، وسجل نشاط زمني (`components/activity-feed.tsx`) يحلّ بريد الفاعل من قائمة أعضاء الشركة الموجودة أصلًا. Migration: `20260902010000_activity_log.sql`. مُنجزة، مبنية (`pnpm build` نظيف)، commit ودفع، ونشر على الإنتاج.
- [ ] **مرحلة 5** — تلميع تشغيلي (مبدّل شركات، onboarding، صلاحيات أدق).

**تنبيه أمني معلّق:** Supabase access token (`sbp_...`) انشارك بالمحادثة كنص صريح أكثر من مرة لتشغيل CLI — يُنصح بتدويره (rotate) من لوحة Supabase، هذا لسا ما تم.

---

## ✅ قائمة التقدّم (Progress Tracker)

> بعد ما تنهي كل مهمة داخل خطوة، ضع [x] فورًا. لا تنتظر لنهاية الخطوة كلها لتحدّث القائمة — حدّثها أول بأول حتى لو انقطعت الجلسة فجأة نعرف بالضبط وين وقفنا.

### Phase 0 — الحد الأدنى للاستخدام اليومي
- [x] **Step 0** — تأسيس المشروع + قاعدة البيانات الفارغة + نشر أولي على Vercel *(منجز وظيفيًا، يحتاج تدقيق design.md ضمن Step 10)*
- [x] **Step 1** — قاعدة البيانات: الهوية، مجالات الحياة، الأهداف، المشاريع، المهام
- [x] **Step 2** — واجهات CRUD الأساسية
- [x] **Step 3** — الصفحة الرئيسية اليومية + إغلاق Phase 0

### Phase 1 — توسيع المجالات + المراجعات اليدوية
- [x] **Step 4** — وحدة العادات (Habits)
- [x] **Step 5** — وحدة المحتوى (Content)
- [x] **Step 6** — وحدة المعرفة (Knowledge Notes)
- [x] **Step 7** — المراجعات اليدوية (Daily & Weekly Review)
- [x] **Step 8** — طبقة التجميع: التقويم الموحّد
- [x] **Step 9** — التحسين والإغلاق النهائي لـ Phase 1 *(زر التصدير موجود، يحتاج تأكيد اختبار فعلي)*

### توسّع كامل (مطلوب صراحة من المستخدم، بدون ذكاء اصطناعي)
- [x] **Step 10** — الإصلاح والتدقيق (Recovery & Design Audit) — أُغلق، تسجيل الدخول (Magic Link) تحقّقت منه المستخدمة
- [x] **Step 11** — قالب صفحة مجال الحياة الغني (تبويبات موحّدة لكل مجال) + صفحة مشروع مستقلة (إضافة متفق عليها)
- [x] **Step 12** — تخزين الملفات (Documents & Files)
- [x] **Step 13** — الاجتماعات والمواعيد (Meetings)
- [x] **Step 14** — CRUD كامل فعليًا (تعديل + حذف حقيقي + سلة محذوفات)
- [x] **Step 15** — شبكة العلاقات اليدوية (entity_links)
- [x] **Step 16** — وحدة المال الكاملة (بدون ذكاء اصطناعي)
- [x] **Step 17** — مساحة عمل الفريق الحقيقية (Companies & Collaboration)
- [x] **Step 18** — التكامل النهائي: أمان، تصميم، ونشر ← **آخر خطوة، أُنجزت**

---

## 🚫 قواعد صارمة — لا تُكسر مهما بدا الأمر منطقيًا

1. **توقف بعد كل خطوة، دائمًا — وهذه القاعدة الأهم في كامل الملف.** لما تخلّص كل مهام خطوة وتتحقق كل الـ Definition of Done الخاصة فيها: حدّث "التقدّم الحالي" أعلاه + علّم صناديق القائمة، اكتب ملخص قصير لما أنجزته وكيف يتحقق منه المستخدم، اقترح **تحسينًا واحدًا قويًا وملموسًا** لاحظته أثناء التنفيذ (تصميم/أداء/تجربة استخدام — اقتراح فقط، القرار للمستخدم)، ثم **اسأل صراحة: "جاهز للانتقال للخطوة التالية؟"** ولا تلمس أي ملف من الخطوة التالية قبل ما يجيك تأكيد صريح ("نعم"، "كمل"، "تمام"...). **إذا لاحظت في أي لحظة إنك نفّذت أكثر من خطوة بدون ما تعرض مراجعة بينهم — توقف فورًا في أقرب نقطة ممكنة، اعرض ملخص لكل الخطوات اللي تجاوزتها دفعة وحدة، ولا تكمل لأي خطوة جديدة قبل ما يراجعها المستخدم صراحة.** هذا ثابت بدون استثناء لأي سبب، حتى لو بدت الخطوة التالية بديهية أو سريعة.
2. **ممنوع تبني أي شيء من هذه القائمة حتى لو بدا سهلاً أو مفيدًا** — إذا احتجت له، توقف واسأل المستخدم بدل ما تنفّذه:
   - أي استدعاء لأي API ذكاء اصطناعي (Anthropic/Claude API أو غيره)
   - جدول `ai_suggestions` أو أي منطق توليد اقتراحات آلية
   - `pgvector` أو أي embeddings
   - تحليل الذكاء الاصطناعي لمحادثات الفريق (جزء مؤجَّل تحديدًا من Step 17 — الشات نفسه داخل النطاق، تحليله بالذكاء الاصطناعي خارجه)
   - صفحة "الرؤية السنوية" الجمالية — لم تُطلب، خارج النطاق
3. **أي قرار شخصي أو غامض غير محدد بوضوح في الخطوة الحالية → توقف واسأل سؤالًا مباشرًا.** لا تخمّن مجالات حياة المستخدم، عاداته، تفضيلاته الشخصية، أو أي قرار معماري غير مذكور هنا صراحة.
4. **لا تُنشئ حسابات نيابة عن المستخدم** (GitHub، Supabase، Vercel) — هذه خطوات يدوية يسويها هو بنفسه. إذا احتجت مفتاح/قيمة ولم تجدها في `.env.local`، اطلبها من المستخدم مباشرة، لا تخترعها ولا تتركها فارغة.
5. **الحذف الفعلي مسموح ومطلوب الآن** (تغيير عن نسخة سابقة من هذا الملف): زر حذف حقيقي متاح على كل كيان بالنظام، بجانب خيار الأرشفة (status) لمن يفضّله. كل حذف يفتح نافذة تأكيد صريحة تذكر بالضبط شو بينحذف، وتحذّر صراحة لو الحذف بيتسبب بحذف كيانات تابعة (`on delete cascade`). التفاصيل الكاملة بـ Step 14.
6. **كل قرار بصري (لغة، ألوان، خطوط، تباعد، مكوّنات) يتبع `design.md` بدون استثناء.** ممنوع اختراع نمط بصري جديد أو تجاهل ما هو مكتوب هناك، وأي شيء غير مذكور فيه → اسأل المستخدم. **هذه القاعدة انتُهكت فعليًا في التنفيذ السابق (Steps 0-9) — Step 10 مخصص لتصحيحها، وأي خطوة بعده تُراجَع مقابل design.md قبل اعتبارها منجزة.**
7. **بيانات الفريق/الشركة المشتركة (من Step 17) تحتاج سياسات RLS مختلفة جذريًا عن البيانات الشخصية.** لا تُطبَّق سياسة `user_id = auth.uid()` البسيطة على الجداول المشتركة — ابنِ سياسات مخصصة تتحقق من عضوية `team_members` الفعلية، واختبرها بحسابين حقيقيين مختلفين قبل اعتبار الخطوة منجزة.

---

## البنية التقنية الثابتة

| الطبقة | الاختيار | السبب |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui | خبرة مباشرة، سرعة بناء واجهات مركّزة |
| قاعدة البيانات | Supabase (Postgres + Row Level Security) | RLS ضروري لبيانات حساسة (مال، قرارات، بيانات فريق) |
| المصادقة | Supabase Auth — Magic Link (OTP بالإيميل) | يدعم دعوة أعضاء فريق حقيقيين بسهولة (Step 17) |
| تخزين الملفات | Supabase Storage | نفس منصة قاعدة البيانات، بلا حاجة خدمة خارجية جديدة |
| الاستضافة | Vercel (منشور فعليًا من Step 0) | — |
| إدارة الحزم | pnpm | — |
| الترحيلات | Supabase CLI migrations، داخل `supabase/migrations/` | — |

**قاعدة تصميم قاعدة البيانات:** كل جدول شخصي فيه `user_id uuid references auth.users(id)` و RLS مفعّل عليه بسياسة `user_id = auth.uid()`. الجداول المشتركة (Step 17 فما بعد) تستخدم سياسات RLS مخصصة مبنية على عضوية `team_members`، ليست نفس القالب الشخصي. استخدم `uuid` كمفتاح أساسي في كل مكان.

---

## 🔧 تجهيزات يدوية لمرة واحدة (المستخدم يسويها بنفسه، مو Claude Code)

قبل بدء Step 0، تأكد الآتي جاهز:
1. مثبت محليًا: Node.js LTS، git، pnpm، Supabase CLI، Vercel CLI (وGitHub CLI `gh` اختياري).
2. حسابات مجانية: GitHub، Supabase، Vercel.
3. مشروع Supabase جديد منشأ، مع حفظ: Project URL + `anon` key + `service_role` key (سري).
4. **لخطوة Step 17 لاحقًا تحديدًا:** إيميل حقيقي لشخص (شريك/موظف) مستعد يجرّب الدعوة الفعلية وقتها.

---

## تفاصيل الخطوات

### Step 0 — تأسيس المشروع، قاعدة البيانات الفارغة، والنشر الأولي

**الهدف:** مشروع فارغ لكنه منشور فعليًا على رابط Vercel حقيقي، مع تسجيل دخول يعمل.

**المهام:**
1. `git init` في هذا المجلد. إذا `gh` متاح ومسجّل دخول: أنشئ GitHub repo فاضي وربطه كـ remote. إذا لا: اسأل المستخدم رابط repo فاضي أنشأه يدويًا.
2. تهيئة مشروع Next.js (App Router + TypeScript + Tailwind) داخل نفس المجلد، تثبيت وتهيئة shadcn/ui.
3. **إعداد i18n حسب `design.md`:** تثبيت وتهيئة `next-intl`، بنية مسارات `app/[locale]/...`، ملفات `messages/ar.json` و `messages/en.json` (عربي كلغة افتراضية)، `<html dir>` ديناميكي حسب اللغة، زر تبديل لغة أولي بسيط في الـ layout.
4. **إعداد الوضع الداكن حسب `design.md`:** تثبيت وتهيئة `next-themes`، الداكن كوضع افتراضي، مع مفتاح تبديل بسيط لوضع فاتح يُطبَّق فوريًا. تأكيد ألوان الخلفية الأساسية (لا أسود خالص) من `design.md`.
5. اطلب من المستخدم القيم الأربع إذا لم تكن موجودة: Supabase Project URL، anon key، service_role key، ورابط GitHub repo (لا تخترعها).
6. إعداد `.env.local` (مُدرج في `.gitignore` من أول commit) + نفس المتغيرات في إعدادات Vercel.
7. تثبيت `@supabase/supabase-js` و`@supabase/ssr`.
8. تفعيل Supabase Auth بـ Magic Link (OTP بالإيميل). صفحة تسجيل دخول بسيطة (مترجمة عبر next-intl) + حماية `/[locale]`.
9. `vercel link` ثم `vercel deploy` — تأكد الرابط المنشور يعمل فعليًا ويقدر المستخدم يسجّل دخول من الجوال، وأن تبديل اللغة والوضع الداكن/الفاتح يعملان فوريًا.
10. commit أولي واضح، git tag `v0.0-bootstrap`.

**Definition of Done:**
- [ ] رابط Vercel حقيقي يفتح ويشتغل من الجوال
- [ ] تسجيل الدخول يعمل فعليًا
- [ ] لا مفاتيح سرية داخل git
- [ ] الكود على GitHub، commit أول موجود

---

### Step 1 — قاعدة البيانات: الهوية والمجالات والأهداف والمشاريع والمهام

```sql
create table life_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  title text not null,
  description text,
  target_date date,
  status text not null default 'active' check (status in ('active','paused','done','dropped')),
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid not null references life_areas(id) on delete cascade,
  goal_id uuid references goals(id) on delete set null,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active','paused','done','dropped')),
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid not null references life_areas(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  notes text,
  due_date date,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  status text not null default 'todo' check (status in ('todo','doing','done')),
  completed_at timestamptz,
  created_at timestamptz default now()
);
```

RLS مفعّل. أنواع TypeScript مولّدة. مجالات الحياة الحقيقية للمستخدم مُدخلة.

**Definition of Done:** ✅ منجز — راجع Step 10 للتدقيق.

---

### Step 2 — واجهات CRUD الأساسية

Layout عام بـ sidebar، صفحة لكل مجال، نماذج إنشاء/تعديل، تحديد مهمة "منجزة"، تجاوب على الجوال.

**Definition of Done:** ✅ منجز — راجع Step 10 للتدقيق، وStep 14 للحذف الفعلي.

---

### Step 3 — الصفحة الرئيسية اليومية + إغلاق Phase 0

صفحة `/` بمهام اليوم والمتأخرة وأقرب المواعيد، إضافة سريعة، تسجيل خروج.

**Definition of Done:** ✅ منجز — راجع Step 10 للتدقيق.

---

### Step 4 — وحدة العادات (Habits)

```sql
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  name text not null,
  frequency text not null default 'daily' check (frequency in ('daily','weekly')),
  active boolean not null default true,
  created_at timestamptz default now()
);

create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references habits(id) on delete cascade,
  log_date date not null,
  done boolean not null default true,
  created_at timestamptz default now(),
  unique (habit_id, log_date)
);
```

**Definition of Done:** ✅ منجز — راجع Step 10 للتدقيق.

---

### Step 5 — وحدة المحتوى (Content)

```sql
create table content_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  status text not null default 'idea' check (status in ('idea','draft','scheduled','published')),
  scheduled_date date,
  notes text,
  created_at timestamptz default now()
);
```

**Definition of Done:** ✅ منجز — راجع Step 10 للتدقيق.

---

### Step 6 — وحدة المعرفة (Knowledge Notes)

```sql
create table knowledge_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  title text not null,
  body text not null,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Definition of Done:** ✅ منجز — راجع Step 10 للتدقيق.

---

### Step 7 — المراجعات اليدوية (Daily & Weekly Review)

```sql
create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('daily','weekly')),
  period_start date not null,
  period_end date not null,
  summary text,
  created_at timestamptz default now()
);

create table review_items (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  kind text not null check (kind in ('win','blocker','conflict','priority_next')),
  content text not null
);

create table decisions (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references reviews(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  related_project_id uuid references projects(id) on delete set null,
  created_at timestamptz default now()
);
```

**Definition of Done:** ✅ منجز — راجع Step 10 للتدقيق. **ذكّر المستخدم دوريًا أن الالتزام الفعلي بالكتابة اليومية/الأسبوعية هنا هو ما يبني بيانات تدريب حقيقية لأي ذكاء اصطناعي مستقبلي — هذا الجزء لا يُبنى بالكود، يُبنى بالاستخدام.**

---

### Step 8 — طبقة التجميع: التقويم الموحّد

صفحة `/calendar` تجمع من `tasks.due_date` + `goals.target_date` + `content_items.scheduled_date`. **ستُوسَّع لاحقًا بـ Step 13 لتشمل `meetings` أيضًا.**

**Definition of Done:** ✅ منجز — راجع Step 10 للتدقيق.

---

### Step 9 — التحسين والإغلاق النهائي لـ Phase 1

زر تصدير البيانات، مراجعة موبايل، تحقق RLS نهائي.

**Definition of Done:** ✅ منجز — تأكد المستخدم فعليًا جرّب زر التصدير قبل اعتبارها كاملة 100%.

---

### Step 10 — الإصلاح والتدقيق (Recovery & Design Audit) ⬅️ الخطوة الحالية

**السياق:** فحص فعلي للموقع المنشور كشف مشاكل محددة يجب حلها قبل أي ميزة جديدة، لأن كل ميزة قادمة ستُبنى فوق نفس الأساس البصري — تصحيحه الآن أرخص بكثير من تصحيحه بعد 8 خطوات إضافية:

1. **بَق مؤكد:** تبديل الوضع الداكن/الفاتح لا يُطبَّق فوريًا على نفس الصفحة — يحتاج تنقّل كامل ليظهر أثره. صلّحه (تحقق من `next-themes` وhydration على الخادم/العميل).
2. **بَق محتمل:** روابط القائمة الجانبية (خصوصًا العادات/المحتوى/الملاحظات/المراجعات) لم تستجب بشكل موثوق عند النقر المتتالي من نفس الصفحة أثناء الاختبار — تحقق بنفسك بالنقر اليدوي، وأصلح إن وُجد خلل فعلي بمنطق التنقّل (Next.js `Link`).
3. **مخالفة design.md مؤكدة:** الخلفية الداكنة الحالية أقرب للأسود الخالص من الرمادي الدافئ المحدد في design.md. صحّح قيم الألوان.
4. **مخالفة design.md مؤكدة:** لا وجود لبطاقات (Cards) أو تباعد بصري أو هوية بصرية — كل صفحة قائمة نصية مجردة. أعد بناء كل صفحة موجودة حاليًا (Home، Calendar، Habits، Content، Notes، Reviews، Life Area pages) لتتبع أنماط design.md فعليًا: بطاقات حقيقية، شارات حالة ملوّنة، حالات فارغة بأيقونة، عنصر هوية بصرية بسيط بأعلى الشريط الجانبي.
5. راجع كل الأسئلة المذكورة بأقسام "اسأل المستخدم عن" بالنسخة السابقة من هذا الملف (Magic Link/كلمة مرور، الأرقام هندية/لاتينية، تبديل لغة فوري أم لا) — إذا اتخذ القرار بدون سؤال فعلي، اعرضه الآن كملخص للمستخدم ليؤكده أو يغيّره.

**Definition of Done:**
- [ ] تبديل الوضع الداكن/الفاتح فوري فعليًا (مُختبر بدون أي تنقّل)
- [ ] كل روابط التنقّل تعمل بالنقر المباشر (مُختبر يدويًا من المستخدم)
- [ ] كل صفحة موجودة حاليًا تتبع design.md فعليًا (راجعها المستخدم بصريًا ووافق صراحة)
- [ ] القرارات المعلّقة من Steps 0-9 مؤكدة من المستخدم

---

### Step 11 — قالب صفحة مجال الحياة الغني

**الهدف:** كل مجال حياة يصير له صفحة تفصيلية واحدة بنفس البنية العامة (تبويبات)، بدل قائمة مسطحة.

**المهام:**
1. أعد تصميم `/areas/[id]` بتبويبات (shadcn/ui Tabs): **نظرة عامة | مشاريع | مهام | ملاحظات | اجتماعات | ملفات**.
2. "نظرة عامة": ملخص مباشر (عدد مشاريع نشطة، مهام متأخرة، آخر ملاحظة، أقرب اجتماع) — استعلام مباشر، بدون أي تلخيص ذكي.
3. باقي التبويبات تعرض بيانات موجودة فعلاً (مصفّاة حسب `life_area_id`) — لا تكرار جداول، فقط عرض مختلف.
4. تبويبي "اجتماعات" و"ملفات" يبقيان فاضيين مؤقتًا لحد Step 12 و13 — بس الهيكل (Tabs) يُبنى الآن موحّدًا.
5. طبّق design.md من البداية هذه المرة (بطاقات، شارات، حالات فارغة).

**اسأل المستخدم عن:** هل يريد نفس التبويبات بالضبط لكل مجال حتى لو بعضها غالبًا فاضي لمجال معيّن، أو يفضّل إخفاء تبويب لم يُستخدم أبدًا لمجال معيّن؟

**Definition of Done:** فتح صفحة مجال "الشركة" ورؤية تبويباته الست، وكل تبويب يعرض بياناته الحقيقية المرتبطة بهذا المجال تحديدًا.

---

### Step 12 — تخزين الملفات (Documents & Files)

```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  file_name text not null,
  storage_path text not null,
  file_type text,
  size_bytes bigint,
  uploaded_at timestamptz default now()
);
```
*(عمود `company_id` يُضاف لاحقًا بـ Step 17 عبر `alter table` — لا تضفه الآن.)*

**المهام:**
1. أنشئ Supabase Storage bucket (مثال: `documents`)، بسياسات وصول توازي RLS (كل مستخدم يوصل لملفاته فقط، عبر مسار يتضمن `user_id`).
2. RLS على جدول `documents` مطابقة للقالب الشخصي.
3. واجهة رفع ملف من تبويب "ملفات" بصفحة مجال الحياة (وبصفحة المشروع إن وُجدت).
4. قائمة الملفات (اسم، نوع، حجم، تاريخ) + زر تنزيل + زر حذف فعلي (بتأكيد، يحذف من Storage والجدول معًا).
5. حد أقصى لحجم الملف (مثال 20MB) مع رسالة خطأ واضحة.

**اسأل المستخدم عن:** أنواع الملفات المتوقعة (PDF/صور/Word فقط، أو أي نوع) — يحدد فلترة الرفع.

**Definition of Done:** رفع ملف حقيقي (عقد تجريبي) على مجال "الشركة"، تنزيله، والتأكد أنه محذوف فعليًا (من Storage لا الجدول بس) بعد الحذف.

---

### Step 13 — الاجتماعات والمواعيد (Meetings)

```sql
create table meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  notes text,
  created_at timestamptz default now()
);
```

**المهام:**
1. RLS مطابقة.
2. نموذج إضافة/تعديل اجتماع من تبويب "اجتماعات" بصفحة المجال.
3. عرض الاجتماعات القادمة بترتيب زمني، تمييز اجتماع اليوم.
4. أضِف `meetings` كمصدر بيانات رابع بصفحة `/calendar` (جنب tasks/goals/content_items — بدون تعديل الجداول القديمة، فقط استعلام إضافي بنفس الصفحة).
5. أضِف الاجتماعات القادمة (٧٢ ساعة القادمة) للصفحة الرئيسية جنب "أقرب المواعيد" الموجودة أصلًا.

**Definition of Done:** إضافة اجتماع حقيقي على مجال "الشركة"، ورؤيته بالتقويم الموحّد وبالصفحة الرئيسية.

---

### Step 14 — CRUD كامل فعليًا (حذف حقيقي في كل مكان)

**المهام:**
1. زر "حذف" فعلي (جنب "أرشفة" حيث موجودة) على: مجالات الحياة، الأهداف، المشاريع، المهام، العادات، عناصر المحتوى، الملاحظات، الاجتماعات، الملفات.
2. نافذة تأكيد تذكر بالضبط شو بينحذف، وتحذّر صراحة لو الحذف بيتسبب بحذف كيانات تابعة (`on delete cascade`) — مثال: "حذف هذا المشروع سيحذف 5 مهام مرتبطة به. متأكد؟"
3. راجع كل علاقة أجنبية موجودة حاليًا: هل `on delete cascade` مقابل `on delete set null` يعكس فعليًا السلوك الصحيح؟ (حذف مجال حياة فيه مشاريع تابعة يجب أن يُحذّر بوضوح، لا يحذفها بصمت).
4. اعرض كلا الخيارين (حذف فعلي / أرشفة) بوضوح بقائمة (⋮) لكل عنصر، بدل فرض واحد بس.
5. **ملاحظة تُطبَّق لاحقًا بـ Step 15:** بما أن الحذف الحقيقي صار متاحًا من هذه الخطوة، وStep 15 لاحقًا بيضيف `entity_links` بلا foreign key حقيقي (polymorphic) — لازم Step 15 يتعامل صراحة مع احتمال حذف عنصر مرتبط لاحقًا (رابط يتيم يشير لسجل محذوف). التفاصيل بـ Step 15 نفسها.

**اسأل المستخدم عن:** هل يريد "سلة محذوفات" مؤقتة (استرجاع خلال فترة قبل الحذف النهائي من قاعدة البيانات)، أو حذف مباشر فوري بدون فترة سماح؟

**Definition of Done:** حذف فعلي (مو أرشفة) لعنصر من كل نوع كيان بالنظام، مع تأكيد اختفائه فعليًا من قاعدة البيانات.

---

### Step 15 — شبكة العلاقات اليدوية (entity_links)

**ملاحظة معمارية:** قيمة هذا الجدول الكاملة تظهر لاحقًا مع الذكاء الاصطناعي (خارج نطاق هذا الملف). الآن هو أداة ربط يدوية صرفة.

```sql
create table entity_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  from_type text not null,
  from_id uuid not null,
  to_type text not null,
  to_id uuid not null,
  relation_label text,
  created_at timestamptz default now()
);
```
*(بدون foreign key حقيقي على `from_id`/`to_id` — polymorphic، التحقق من صحة الربط على مستوى التطبيق.)*

**المهام:**
1. RLS مطابقة.
2. زر "اربط بعنصر آخر" على أي صفحة تفاصيل (مهمة، مشروع، ملف، اجتماع، ملاحظة) يفتح بحث نصي بسيط عبر كل الكيانات، ويختار المستخدم العنصر + علاقة (نص حر قصير، مثال: "يتعارض مع"، "جزء من"، "مرجع لـ").
3. قسم "عناصر مرتبطة" بأسفل كل صفحة تفاصيل يعرض كل الروابط من/إلى هذا العنصر، بروابط قابلة للنقر.
4. حذف رابط فردي بدون التأثير على العنصرين أنفسهم.
5. **تنظيف الروابط اليتيمة (إلزامي):** بما أن الحذف الحقيقي متاح من Step 14 وأنواع الكيانات هنا polymorphic بلا foreign key حقيقي، أضف إما (أ) دالة/trigger على مستوى قاعدة البيانات يحذف أي صف `entity_links` تلقائيًا عند حذف العنصر المرتبط به (يحتاج تنفيذ يدوي لكل نوع كيان بما أنه polymorphic، مثال: trigger على `tasks` ينظّف `entity_links` اللي `from_type='task' and from_id = old.id` أو `to_type='task' and to_id = old.id`)، أو (ب) تحقق عند القراءة يتجاهل بصمت أي رابط يشير لعنصر لم يعد موجودًا. اختر (أ) إن أمكن — أنظف وأقل مفاجآت لاحقًا.

**اسأل المستخدم عن:** أمثلة حقيقية من حياته يريد ربطها (مثال: عقد بمشروع، امتحان بمهمة) — للتأكد أن التصميم عملي فعليًا.

**Definition of Done:** ربط عنصرين حقيقيين ببعض (مثال: ملف عقد بمشروع بالشركة)، ورؤية الربط من صفحتي الطرفين.

---

### Step 16 — وحدة المال الكاملة (بدون ذكاء اصطناعي)

```sql
create table finance_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('cash','bank','credit','savings')),
  currency text not null default 'ILS',
  opening_balance numeric not null default 0,
  created_at timestamptz default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references finance_accounts(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  amount numeric not null,
  direction text not null check (direction in ('in','out')),
  category text,
  occurred_at date not null,
  note text,
  is_recurring boolean not null default false,
  recurrence_rule text,
  created_at timestamptz default now()
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  category text not null,
  monthly_limit numeric not null,
  created_at timestamptz default now()
);

create table financial_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_amount numeric not null,
  current_amount numeric not null default 0,
  target_date date,
  created_at timestamptz default now()
);
```

**المهام:**
1. RLS على الجداول الأربعة.
2. صفحة `/finance`: الحسابات وأرصدتها المحسوبة (رصيد افتتاحي + مجموع الحركات)، إضافة حركة (دخل/مصروف) مرتبطة بمجال حياة اختياريًا.
3. تصنيف الحركات المتكررة (`is_recurring`) + تذكير Badge بالصفحة الرئيسية قبل الاستحقاق بأيام — **تذكير تاريخ ثابت بدون أي تحليل أو توصية ذكاء اصطناعي.**
4. صفحة ميزانيات: حد شهري لكل تصنيف + شريط تقدّم بصري مقابل الفعلي هذا الشهر (حساب SQL/كود مباشر).
5. أهداف مالية بعرض نسبة تقدّم بسيطة.

**اسأل المستخدم عن:** العملة الافتراضية، وحساباته الفعلية الحالية ليُدخلها كبيانات بداية حقيقية.

**Definition of Done:** إدخال حساب وحركة حقيقيين، رصيد محسوب صح، وتذكير التزام متكرر واحد شغّال.

---

### Step 17 — مساحة عمل الفريق الحقيقية (Companies & Collaboration)

**أعلى خطوة مخاطرة تقنيًا بالمشروع — لذلك آخر خطوة قبل التدقيق النهائي، رغم كونها مطلوبة الآن.** السبب: RLS متعدد المستخدمين مختلف جذريًا عن كل ما سبق، ويستاهل يُبنى فوق أساس مستقر ومُختبر بدل ما يكون أول شي.

```sql
create table companies (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  role text not null default 'member' check (role in ('owner','member')),
  status text not null default 'invited' check (status in ('invited','active','removed')),
  invited_at timestamptz default now(),
  joined_at timestamptz
);

create table project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table projects add column company_id uuid references companies(id) on delete set null;
alter table documents add column company_id uuid references companies(id) on delete set null;
```

**المهام:**
1. RLS **مخصصة وليست القالب الشخصي القديم**: `companies` تُقرأ/تُعدَّل من `owner_user_id` أو أعضاء نشطين بـ `team_members`. `projects` المرتبطة بـ `company_id` تُقرأ من كل عضو نشط بنفس الشركة. `project_messages` بنفس منطق العضوية.
2. تدفّق دعوة عضو: إدخال إيميل → صف `team_members` بحالة `invited` → دعوة عبر Supabase Auth invite (أو رابط يدوي بالبداية) → عند تسجيل دخول المدعو بنفس الإيميل، يُربط `user_id` تلقائيًا وتتحدّث الحالة لـ `active`.
3. عند إنشاء مشروع، خيار اختياري لربطه بشركة موجودة (`company_id`) بدل ما يبقى شخصيًا بحتًا.
4. شات بسيط داخل صفحة المشروع المشترك (`project_messages`) — رسائل نصية فقط، **بدون أي تحليل ذكاء اصطناعي عليها.**
5. **اختبار أمان صارم إلزامي:** أنشئ شركتين تجريبيتين بعضوين مختلفين، تأكد عضو الشركة أ لا يقدر يشوف ولا حرف من مشاريع/رسائل/ملفات الشركة ب.

**اسأل المستخدم عن:** هل يبدأ فعليًا بدعوة الشخص الحقيقي (الشريك/الموظف الذي جهّز إيميله بالتجهيزات اليدوية) فور اكتمال هذه الخطوة، للتأكد من الصلاحيات على حالة استخدام حقيقية؟

**Definition of Done:** إنشاء شركة، دعوة عضو حقيقي بإيميل حقيقي، دخوله فعليًا، ورؤيته لمشروع مشترك واحد بس دون أي بيانات شخصية أخرى لصاحب الحساب الأصلي.

---

### Step 18 — التكامل النهائي: أمان، تصميم، ونشر

**المهام:**
1. تدقيق RLS شامل على **كل** جدول بالمشروع (شخصي ومشترك) — قائمة صريحة، جدول جدول، بنتيجة اختبار مكتوبة.
2. تدقيق design.md شامل على **كل** صفحة أُضيفت من Step 10 لهون (المال، الفريق، الملفات، الاجتماعات، العلاقات) — نفس معايير Step 10 بالضبط.
3. مراجعة أداء الصفحات كثيرة الاستعلامات (نظرة عامة لمجال الحياة، الصفحة الرئيسية).
4. نشر نهائي، git tag `v2.0-full-data-layer-done`.

**Definition of Done:** كل الميزات من Step 0 إلى Step 17 شغّالة على رابط Vercel واحد، بأمان مُختبر فعليًا، وتصميم متسق حسب design.md على كل صفحة بدون استثناء.

بعد هذا: **لا تبدأ أي طبقة ذكاء اصطناعي تلقائيًا.** كل ما بُني هنا بيانات ووظائف وتعاون بشري فقط. الخطوة التالية (الذكاء الاصطناعي الفعلي، بمصطلح VISION.md) تحتاج ملف تنفيذ منفصل جديد، يُبنى بقرار واعٍ من المستخدم بعد تراكم استخدام حقيقي كافٍ.
