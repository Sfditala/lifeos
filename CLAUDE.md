# CLAUDE.md — تعليمات دائمة لهذا المشروع

هذا الملف يُقرأ تلقائيًا من Claude Code في بداية كل جلسة داخل هذا المجلد. اقرأه بالكامل قبل أي عمل — وخصوصًا قسم **"التقدّم الحالي"** (لتعرف وين وصلت آخر مرة) وقسم **"قواعد صارمة"** (لا تُكسر مهما حصل).

المشروع: نظام تشغيل شخصي ومهني واحد (Personal Life & Business OS) — يدير الأهداف والمشاريع والمهام والعادات والمحتوى والمعرفة في مكان واحد، بدل أدوات متفرقة. هذا الملف يغطي **Phase 0 + Phase 1 فقط**: بناء الواجهة الأمامية والخلفية والبيانات — **بدون أي طبقة ذكاء اصطناعي إطلاقًا** في هذا النطاق.

📎 **اقرأ أيضًا `design.md` في نفس المجلد قبل بناء أي صفحة أو مكوّن** — يحدّد اللغة/الاتجاه (عربي/إنجليزي، RTL/LTR)، الوضع الداكن الافتراضي، الخطوط، نظام الألوان، وأنماط المكوّنات الموحّدة. أي قرار بصري غير مذكور هناك → اسأل المستخدم، لا تخترع.

📎 **اقرأ أيضًا `VISION.md` في نفس المجلد للفهم الكامل للفكرة بكل مراحلها الست (Phase 0 → Phase 6)** — هذا الملف (CLAUDE.md) **ينفّذ فقط Phase 0 و Phase 1** المذكورتين هناك. VISION.md لا يُنفَّذ منه شيء الآن — هو سياق فهم فقط، ومرجع لكتابة ملف تنفيذ جديد لأي مرحلة لاحقة مستقبلًا (Phase 2 فما فوق) عند الحاجة.

---

## 📍 التقدّم الحالي (حدّث هذا السطر بنفسك بعد كل إنجاز، قبل أي شيء آخر)

**الخطوة الحالية: Step 9 — قيد الإغلاق.**
**الحالة: Phase 0 كامل (Step 0-3) وPhase 1 (Step 4-8) خلصوا بالبناء والكود. زر التصدير جاهز. الباقي: نشر نهائي + مراجعة استخدام فعلي من المستخدم على الموبايل (لا يقدر Claude يتحقق من هذا بنفسه) + tag v1.0-phase1-done.**

---

## ✅ قائمة التقدّم (Progress Tracker)

> بعد ما تنهي كل مهمة داخل خطوة، ضع [x] فورًا. لا تنتظر لنهاية الخطوة كلها لتحدّث القائمة — حدّثها أول بأول حتى لو انقطعت الجلسة فجأة نعرف بالضبط وين وقفنا.

### Phase 0 — الحد الأدنى للاستخدام اليومي
- [x] **Step 0** — تأسيس المشروع + قاعدة البيانات الفارغة + نشر أولي على Vercel
- [x] **Step 1** — قاعدة البيانات: الهوية، مجالات الحياة، الأهداف، المشاريع، المهام
- [x] **Step 2** — واجهات CRUD الأساسية
- [x] **Step 3** — الصفحة الرئيسية اليومية + إغلاق Phase 0

### Phase 1 — توسيع المجالات + المراجعات اليدوية
- [x] **Step 4** — وحدة العادات (Habits)
- [x] **Step 5** — وحدة المحتوى (Content)
- [x] **Step 6** — وحدة المعرفة (Knowledge Notes)
- [x] **Step 7** — المراجعات اليدوية (Daily & Weekly Review)
- [x] **Step 8** — طبقة التجميع: التقويم الموحّد
- [ ] **Step 9** — التحسين والإغلاق النهائي لـ Phase 1 (زر التصدير ✅، RLS متحقق منه ✅ — باقي: استخدام حقيقي فعلي + مراجعة موبايل من المستخدم نفسه)

---

## 🚫 قواعد صارمة — لا تُكسر مهما بدا الأمر منطقيًا

1. **توقف بعد كل خطوة، دائمًا.** لما تخلّص كل مهام خطوة وتتحقق كل الـ Definition of Done الخاصة فيها: حدّث "التقدّم الحالي" أعلاه + علّم صناديق القائمة، اكتب ملخص قصير لما أنجزته وكيف يتحقق منه المستخدم، ثم **اسأل صراحة: "جاهز للانتقال للخطوة التالية؟"** ولا تلمس أي ملف من الخطوة التالية قبل ما يجيك تأكيد صريح ("نعم"، "كمل"، "تمام"...). هذا ثابت لكل خطوة بدون استثناء.
2. **ممنوع تبني أي شيء من هذه القائمة حتى لو بدا سهلاً أو مفيدًا** — إذا احتجت له، توقف واسأل المستخدم بدل ما تنفّذه:
   - أي استدعاء لأي API ذكاء اصطناعي (Anthropic/Claude API أو غيره)
   - جدول `entity_links` أو أي منطق علاقات تلقائي بين الكيانات
   - جدول `ai_suggestions`
   - أي شيء متعلق بالمال (`finance_accounts`, `transactions`, `budgets`) — Phase 4 لاحقًا
   - أي شيء متعلق بالفرق/الشركات (`companies`, `teams`, `team_members`) — Phase 5 لاحقًا
   - `pgvector` أو أي embeddings — Phase 2 لاحقًا
   - صفحة "الرؤية السنوية" الجمالية — Phase 6 لاحقًا
3. **أي قرار شخصي أو غامض غير محدد بوضوح في الخطوة الحالية → توقف واسأل سؤالًا مباشرًا.** لا تخمّن مجالات حياة المستخدم، عاداته، تفضيلاته الشخصية، أو أي قرار معماري غير مذكور هنا صراحة.
4. **لا تُنشئ حسابات نيابة عن المستخدم** (GitHub، Supabase، Vercel) — هذه خطوات يدوية يسويها هو بنفسه (انظر "تجهيزات يدوية" أدناه). إذا احتجت مفتاح/قيمة ولم تجدها في `.env.local`، اطلبها من المستخدم مباشرة، لا تخترعها ولا تتركها فارغة.
5. **لا حذف فعلي لبيانات المستخدم** بدون تأكيد صريح منه في نافذة confirm داخل الواجهة — استخدم حقول status (active/archived) بدل الحذف الحقيقي حيثما أمكن.
6. **كل قرار بصري (لغة، ألوان، خطوط، تباعد، مكوّنات) يتبع `design.md` بدون استثناء.** ممنوع اختراع نمط بصري جديد أو تجاهل ما هو مكتوب هناك، وأي شيء غير مذكور فيه → اسأل المستخدم.

---

## البنية التقنية الثابتة

| الطبقة | الاختيار |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui |
| قاعدة البيانات | Supabase (Postgres + Row Level Security) |
| المصادقة | Supabase Auth — Magic Link (OTP بالإيميل) |
| الاستضافة | Vercel (منشور فعليًا من Step 0، ليس محليًا فقط) |
| إدارة الحزم | pnpm |
| الترحيلات | Supabase CLI migrations، داخل `supabase/migrations/` في نفس الـ repo |

**قاعدة تصميم قاعدة البيانات:** كل جدول جديد فيه `user_id uuid references auth.users(id)` و RLS مفعّل عليه بسياسة واحدة ثابتة (`user_id = auth.uid()` على كل عملية). استخدم `uuid` كمفتاح أساسي في كل مكان (يسهّل ربط جداول علاقات لاحقًا في Phase 3 بدون إعادة هيكلة).

---

## 🔧 تجهيزات يدوية لمرة واحدة (المستخدم يسويها بنفسه، مو Claude Code)

قبل بدء Step 0، تأكد الآتي جاهز:
1. مثبت محليًا: Node.js LTS، git، pnpm، Supabase CLI، Vercel CLI (وGitHub CLI `gh` اختياري لكنه يسهّل إنشاء الـ repo تلقائيًا).
2. حسابات مجانية: GitHub، Supabase، Vercel.
3. مشروع Supabase جديد منشأ، مع حفظ: Project URL + `anon` key + `service_role` key (سري) في مكان آمن مؤقتًا — جهّزها لتعطيها لـ Claude Code وقت الطلب في Step 0.
4. المجلد الحالي فاضي تمامًا (لا يوجد git ولا كود بعد) — Claude Code سيبدأ من الصفر فعليًا في Step 0، بما فيها `git init` وإنشاء الـ GitHub repo نفسه (يستخدم `gh repo create` إذا متاح ومُسجّل دخول، وإلا يسأل المستخدم رابط repo فاضي أنشأه يدويًا).

---

## تفاصيل الخطوات

### Step 0 — تأسيس المشروع، قاعدة البيانات الفارغة، والنشر الأولي

**الهدف:** مشروع فارغ لكنه منشور فعليًا على رابط Vercel حقيقي، مع تسجيل دخول يعمل.

**المهام:**
1. `git init` في هذا المجلد. إذا `gh` متاح ومسجّل دخول: أنشئ GitHub repo فاضي وربطه كـ remote. إذا لا: اسأل المستخدم رابط repo فاضي أنشأه يدويًا.
2. تهيئة مشروع Next.js (App Router + TypeScript + Tailwind) داخل نفس المجلد، تثبيت وتهيئة shadcn/ui.
3. **إعداد i18n حسب `design.md`:** تثبيت وتهيئة `next-intl`، بنية مسارات `app/[locale]/...`، ملفات `messages/ar.json` و `messages/en.json` (عربي كلغة افتراضية)، `<html dir>` ديناميكي حسب اللغة، زر تبديل لغة أولي بسيط في الـ layout (حتى لو بدون صفحات فعلية بعد).
4. **إعداد الوضع الداكن حسب `design.md`:** تثبيت وتهيئة `next-themes`، الداكن كوضع افتراضي، مع مفتاح تبديل بسيط لوضع فاتح. تأكيد ألوان الخلفية الأساسية (لا أسود خالص) من `design.md`.
5. اطلب من المستخدم القيم الأربع إذا لم تكن موجودة: Supabase Project URL، anon key، service_role key، ورابط GitHub repo (لا تخترعها).
6. إعداد `.env.local` (مُدرج في `.gitignore` من أول commit) + نفس المتغيرات في إعدادات Vercel (عبر `vercel env add` أو إرشاد المستخدم لإضافتها يدويًا من الداشبورد).
7. تثبيت `@supabase/supabase-js` و`@supabase/ssr`.
8. تفعيل Supabase Auth بـ Magic Link (OTP بالإيميل). صفحة تسجيل دخول بسيطة (مترجمة عبر next-intl) + حماية `/[locale]` (redirect لصفحة الدخول لو غير مسجل).
9. `vercel link` ثم `vercel deploy` — تأكد الرابط المنشور يعمل فعليًا ويقدر المستخدم يسجّل دخول من الجوال، وأن تبديل اللغة والوضع الداكن/الفاتح يعملان.
10. commit أولي واضح، git tag `v0.0-bootstrap`.

**اسأل المستخدم عن:**
- تأكيد Magic Link مقبولة كطريقة دخول، أو يفضّل كلمة مرور تقليدية؟
- اسم المشروع الظاهر في التطبيق (بالعربي والإنجليزي).
- هل تبديل اللغة يحتاج فوريًا بدون إعادة تحميل، أو تبديل عادي كافٍ؟ (من design.md)
- الأرقام: هندية أم لاتينية بالواجهة العربية؟ (من design.md)

**Definition of Done:**
- [ ] رابط Vercel حقيقي يفتح ويشتغل من الجوال
- [ ] تسجيل الدخول يعمل فعليًا (اختبار بإيميل حقيقي)
- [ ] لا مفاتيح سرية داخل git
- [ ] الكود على GitHub، commit أول موجود

---

### Step 1 — قاعدة البيانات: الهوية والمجالات والأهداف والمشاريع والمهام

**الهدف:** جداول حقيقية محمية بـ RLS، بدون واجهة بعد (تلك في Step 2).

**المهام:**
1. Migration بالجداول التالية (أساس، عدّل القيود حسب الحاجة لكن حافظ على البنية العامة):

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

2. تفعيل RLS على الجداول الأربعة (`user_id = auth.uid()` لكل عملية).
3. توليد أنواع TypeScript (`supabase gen types typescript`) → `types/database.ts`.
4. اختبار RLS فعليًا بمستخدمين تجريبيين، ثم حذف بيانات الاختبار.

**اسأل المستخدم عن:**
- ما هي مجالات الحياة الحقيقية التي يريد البدء بها؟ (اطلب قائمته الفعلية، لا تفترض)
- هل يريد حقل نسبة إنجاز يدوية على الأهداف الآن، أو تكفي حالة نصية بالبداية؟

**Definition of Done:**
- [ ] الجداول الأربعة موجودة مع RLS مفعّل ومُختبر فعليًا
- [ ] أنواع TypeScript مولّدة وموجودة بالكود
- [ ] مجالات الحياة الحقيقية للمستخدم مُدخلة كصفوف ابتدائية

---

### Step 2 — واجهات CRUD الأساسية

**المهام:**
1. Layout عام: sidebar بمجالات الحياة الحقيقية، رابط لكل مجال.
2. صفحة لكل مجال (`/areas/[id]`): أهدافه، مشاريعه، مهامه المباشرة.
3. نماذج إنشاء/تعديل لكل من: مجال حياة، هدف، مشروع، مهمة (shadcn/ui Dialog/Sheet).
4. تحديد مهمة "منجزة" بضغطة واحدة، تسجيل `completed_at` تلقائيًا.
5. حذف/أرشفة عبر status، مع نافذة confirm لأي إجراء غير قابل للتراجع.
6. تحقق فعلي من التجاوب على شاشة الجوال.

**اسأل المستخدم عن:**
- ترتيب يدوي للمهام (drag) أو يكفي ترتيب تلقائي حسب الأولوية/التاريخ بالبداية؟

**Definition of Done:**
- [ ] إضافة/تعديل/إكمال مهمة كاملة من الواجهة فقط
- [ ] بيانات حقيقية مُدخلة، لا بيانات تجريبية متبقية
- [ ] يعمل بشكل مريح على الجوال، ومنشور على Vercel

---

### Step 3 — الصفحة الرئيسية اليومية + إغلاق Phase 0

**المهام:**
1. صفحة `/` تعرض تلقائيًا (استعلام مباشر، بدون أي تلخيص ذكي): مهام اليوم، المهام المتأخرة، أقرب 3 مواعيد أهداف/مشاريع قادمة.
2. زر "إضافة سريعة" لمهمة من نفس الصفحة الرئيسية.
3. مراجعة شاملة: حالات فارغة واضحة، رسائل خطأ مفهومة، تسجيل خروج يعمل.
4. مراجعة أمان: تأكد عدم تسريب أي مفتاح سري في bundle الـ frontend.
5. نشر نهائي، git tag `v0.1-phase0-done`.

**Definition of Done (= Phase 0 DoD الكامل):**
- [ ] منشور على رابط Vercel ثابت، يعمل من الجوال
- [ ] تسجيل الدخول آمن (RLS مُختبر)
- [ ] مجالات حياة حقيقية + أهداف/مشاريع/مهام حقيقية مُدخلة
- [ ] الصفحة الرئيسية تعرض مهام اليوم والمتأخرة تلقائيًا
- [ ] **استُخدم فعليًا 3-4 أيام متتالية قبل الانتقال لـ Phase 1** (اسأل المستخدم صراحة هل استخدمه فعليًا قبل ما توافق على الانتقال لـ Step 4)

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
RLS مطابقة. صفحة `/habits`: checkbox "اليوم" لكل عادة + عدّاد streak بسيط. إضافة/تعطيل عادة من نفس الصفحة.

**اسأل المستخدم عن:** عاداته الفعلية التي يريد تتبعها (قائمة حقيقية).

**Definition of Done:** تسجيل عادة "منجزة اليوم" فعليًا من الجوال، والـ streak يتحدّث.

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
RLS مطابقة. صفحة `/content`: عرض بسيط حسب status (فكرة/مسودة/مجدول/منشور).

**اسأل المستخدم عن:** هل المحتوى مرتبط بمشاريعه الفعلية (Al Rank / Tawjihi Companion)؟ اربط `project_id` إذا نعم.

**Definition of Done:** إضافة فكرة محتوى ونقلها بين الحالات حتى "منشور".

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
(بدون embeddings/pgvector — ممنوع هنا). RLS مطابقة. صفحة `/notes`: إنشاء/تعديل، بحث نصي بسيط (`ilike`).

**Definition of Done:** كتابة ملاحظة وإيجادها بالبحث النصي.

---

### Step 7 — المراجعات اليدوية (Daily & Weekly Review)

**أهم خطوة في Phase 1** — الهدف بناء بيانات تدريب حقيقية لذكاء اصطناعي مستقبلي (Phase 2)، لذلك الكتابة يدوية بالكامل، بدون أي توليد تلقائي.

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

نموذج مراجعة يومية (`/reviews/new?type=daily`): يعرض تلقائيًا (للقراءة فقط) مهام اليوم المنجزة/المتأخرة من البيانات الحقيقية، ثم حقول يكتبها المستخدم يدويًا: ملخص اليوم، أهم إنجاز، أهم عائق، أي تعارض بين مجالين (نص حر)، أولويات الغد. نموذج أسبوعي مشابه بمدى أسبوع + مقارنة نصية "خطة مقابل واقع". صفحة `/reviews` لعرض السجل.

**اسأل المستخدم عن:** تذكير داخلي بسيط (Badge) لتعبئة المراجعة، أو يعتمد على انضباطه الشخصي؟

**Definition of Done:** مراجعة يومية حقيقية واحدة على الأقل مكتوبة، ونموذج المراجعة الأسبوعية جاهز.

---

### Step 8 — طبقة التجميع: التقويم الموحّد

صفحة `/calendar` تجمع (بدون جدول جديد) من `tasks.due_date` + `goals.target_date` + `content_items.scheduled_date` على خط زمني واحد، بتمييز بسيط حسب مجال الحياة/النوع. بدون أي منطق ذكاء اصطناعي — مجرد عرض موحّد.

**Definition of Done:** رؤية عناصر من أكثر من مجال حياة على نفس اليوم فعليًا.

---

### Step 9 — التحسين والإغلاق النهائي لـ Phase 1

1. زر "تصدير بياناتي": تصدير كل جداول المستخدم كملف JSON واحد قابل للتنزيل.
2. مراجعة شاملة للموبايل، إصلاح أي كسر بصري.
3. حقل نصي حر اختياري "مرتبط بـ" على المهام/المشاريع (نص فقط، **ليس** جدول علاقات — ذاك Phase 3).
4. تحقق نهائي: RLS مُختبر فعليًا على كل الجداول التسعة الجديدة.
5. نشر نهائي، git tag `v1.0-phase1-done`.

**Definition of Done (= Phase 1 DoD الكامل):**
- [ ] كل الوحدات الست تُستخدم فعليًا ببيانات حقيقية
- [ ] مراجعة يومية لمدة أسبوعين متتاليين على الأقل + مراجعة أسبوعية واحدة على الأقل
- [ ] زر تصدير البيانات يعمل ومُجرَّب فعليًا
- [ ] لا وجود لأي كود ذكاء اصطناعي أو `entity_links` في المشروع

بعد هذا: **لا تبدأ Phase 2 تلقائيًا.** ذكّر المستخدم أن الخطوة التالية تحتاج ملف منفصل جديد (خارج نطاق هذا الملف)، وأن القرار يعتمد هل تراكمت بيانات مراجعات حقيقية كافية.
