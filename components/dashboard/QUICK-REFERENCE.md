# Dashboard Components - Quick Reference

## Component Usage

### GreetingCard
```tsx
<GreetingCard 
  userName="Ibu Sarah" 
  progressPercentage={65}
/>
```

### ProgressOverviewCard
```tsx
<ProgressOverviewCard
  percentage={65}
  items={[
    { label: 'Pre-Test', completed: true },
    { label: 'Sesi Belajar (3/5)', completed: false },
    { label: 'Post-Test', completed: false }
  ]}
/>
```

### ContinueLearningCard
```tsx
<ContinueLearningCard
  sessionNumber={3}
  sessionTitle="Pengobatan & Komplikasi"
  description="Pahami pengobatan dan komplikasi pneumonia"
  href="/session/3"
  estimatedTime="15-20 menit"
/>
```

### SessionCard
```tsx
<SessionCard
  day={1}
  title="Dasar-Dasar Pneumonia"
  status="completed" // 'active' | 'completed' | 'locked'
  unlockTime="2024-03-07T10:00:00Z"
  index={0}
  onUnlock={() => refreshData()}
/>
```

### TipsCard
```tsx
<TipsCard tip="Konsistensi adalah kunci untuk memahami pencegahan pneumonia." />
```

### AchievementCard
```tsx
<AchievementCard
  preTestScore={60}
  postTestScore={85}
/>
```

## Color Reference

Primary Blue: `#2563EB`
Sky Blue: `#38BDF8`
Success Green: `#22C55E`
Warning Amber: `#F59E0B`

## Layout Classes

Container: `max-w-7xl mx-auto px-5 lg:px-8`
Grid 2 Col: `grid grid-cols-1 lg:grid-cols-2 gap-6`
Grid 3 Col: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
