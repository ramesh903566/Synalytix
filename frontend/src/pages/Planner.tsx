import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, ChevronLeft, ChevronRight, X, Check, Trash2, Calendar, Link as LinkIcon, Edit, Clock, GripVertical } from 'lucide-react';
import { useAppContext, PlannerTask, PlannerCategory, ExternalCalendarProvider } from '../context/AppContext';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday-indexed
}

type PlannerView = 'unplanned' | 'planned' | 'all';

export default function Planner() {
  const { plannerTasks, addPlannerTask, updatePlannerTask, deletePlannerTask, calendarConnections, connectCalendar, externalEvents } = useAppContext();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<PlannerView>('unplanned');
  const [categoryFilter, setCategoryFilter] = useState<PlannerCategory | 'all'>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('content');
  const [newTaskCategory, setNewTaskCategory] = useState<PlannerCategory>('content');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskStatus, setNewTaskStatus] = useState<PlannerTask['status']>('unplanned');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskColor, setNewTaskColor] = useState('');

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const getDateStr = (day: number) => `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const tasksOnDate = (day: number) => plannerTasks.filter(t => t.scheduledDate === getDateStr(day));

  const filteredTasks = plannerTasks.filter(t => {
    let statusMatch = true;
    if (view === 'unplanned') statusMatch = t.status === 'unplanned';
    if (view === 'planned') statusMatch = t.status === 'scheduled' || t.status === 'todo';
    
    let categoryMatch = true;
    if (categoryFilter !== 'all') categoryMatch = t.category === categoryFilter;

    return statusMatch && categoryMatch;
  });

  const selectedDateTasks = selectedDate ? plannerTasks.filter(t => t.scheduledDate === selectedDate) : [];

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addPlannerTask({
      title: newTaskTitle,
      projectId: newTaskProject,
      category: newTaskCategory,
      status: newTaskDate ? 'scheduled' : newTaskStatus,
      scheduledDate: newTaskDate || undefined,
      scheduledTime: newTaskTime || undefined,
      priority: newTaskPriority,
      color: newTaskColor || undefined,
    });
    setNewTaskTitle('');
    setNewTaskDate('');
    setNewTaskTime('');
    setNewTaskColor('');
    setNewTaskCategory('content');
    setShowAddTask(false);
  };

  const getStatusColor = (status: PlannerTask['status']) => {
    if (status === 'done') return 'bg-success-light text-success-text';
    if (status === 'scheduled') return 'bg-info-light text-info-text';
    if (status === 'todo') return 'bg-warning-light text-warning-text';
    return 'bg-bg-sunken text-text-muted';
  };

  const getPriorityDot = (p: PlannerTask['priority']) => {
    if (p === 'high') return 'bg-error';
    if (p === 'medium') return 'bg-warning';
    return 'bg-success';
  };

  const getCategoryColor = (c: PlannerCategory) => {
    if (c === 'content') return 'bg-brand/10 text-brand border-brand/20';
    if (c === 'dev') return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    if (c === 'business') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getCategoryDotColor = (c: PlannerCategory | 'google-event', customColor?: string) => {
    if (customColor) return customColor; // If custom color is provided, we use it as style bg, not Tailwind class
    if (c === 'content') return 'var(--color-brand)';
    if (c === 'dev') return '#6366f1';
    if (c === 'business') return '#10b981';
    if (c === 'google-event') return '#4285F4';
    return '#6b7280';
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updatePlannerTask(taskId, { scheduledDate: dateStr, status: 'scheduled' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-12">
      <header className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight mb-2 text-text-primary">Planner</h1>
        <p className="text-text-muted text-sm">Organise and schedule your content tasks and coding goals.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Todo List Panel */}
        <div className="col-span-5 flex flex-col gap-4">
          {/* View Selector */}
          {/* View & Category Selectors */}
          <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-2 shadow-level-1 flex flex-col gap-2">
            <div className="flex gap-2">
              {(['unplanned', 'planned', 'all'] as PlannerView[]).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-card-inner)] text-sm font-medium transition-all ${view === v ? 'bg-bg-sunken text-text-primary' : 'text-text-secondary hover:bg-bg-canvas'}`}>
                  {v === 'unplanned' ? 'Unplanned' : v === 'planned' ? 'Planned' : 'All Tasks'}
                </button>
              ))}
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar border-t border-border/50 pt-2">
              {(['all', 'content', 'dev', 'business', 'other'] as (PlannerCategory | 'all')[]).map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${categoryFilter === c ? 'bg-text-primary text-text-inverse border border-transparent' : 'bg-bg-canvas text-text-secondary hover:bg-bg-sunken border border-border/50'}`}>
                  {c !== 'all' && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryDotColor(c as PlannerCategory) }} />}
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Add Task */}
          <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-4 shadow-level-1">
            {showAddTask ? (
              <div className="space-y-3">
                <input
                  autoFocus
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  placeholder="Task title…"
                  className="w-full text-sm p-3 bg-bg-canvas border border-border rounded-[var(--radius-input)] outline-none focus:border-brand transition-all text-text-primary"
                />
                <div className="grid grid-cols-3 gap-2">
                  <select value={newTaskCategory} onChange={e => setNewTaskCategory(e.target.value as PlannerCategory)}
                    className="text-xs p-2 bg-bg-canvas border border-border rounded-[var(--radius-chip)] outline-none text-text-primary">
                    <option value="content">Content</option>
                    <option value="dev">Development</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                  <select value={newTaskProject} onChange={e => setNewTaskProject(e.target.value)}
                    className="text-xs p-2 bg-bg-canvas border border-border rounded-[var(--radius-chip)] outline-none text-text-primary">
                    <option value="none">No Project</option>
                    <option value="synalytix">Synalytix</option>
                    <option value="marketing">Marketing</option>
                  </select>
                  <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="text-xs p-2 bg-bg-canvas border border-border rounded-[var(--radius-chip)] outline-none text-text-primary">
                    <option value="low">Low priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)}
                    className="text-xs p-2 bg-bg-canvas border border-border rounded-[var(--radius-chip)] outline-none text-text-primary" />
                  <input type="time" value={newTaskTime} onChange={e => setNewTaskTime(e.target.value)}
                    className="text-xs p-2 bg-bg-canvas border border-border rounded-[var(--radius-chip)] outline-none text-text-primary" />
                </div>
                <div className="flex gap-2 items-center mb-3">
                  <span className="text-xs text-text-muted">Color:</span>
                  {['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'].map(color => (
                    <button
                      key={color || 'default'}
                      onClick={() => setNewTaskColor(color)}
                      className={`w-5 h-5 rounded-full flex-shrink-0 border-2 transition-all ${newTaskColor === color ? 'border-text-primary scale-110' : 'border-transparent hover:scale-110'}`}
                      style={{ backgroundColor: color || getCategoryDotColor(newTaskCategory) }}
                      title={color ? 'Custom color' : 'Default category color'}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddTask} className="flex-1 py-2 bg-brand text-text-inverse text-xs font-bold rounded-[var(--radius-button)] hover:bg-brand-hover transition-colors shadow-level-1">Add Task</button>
                  <button onClick={() => setShowAddTask(false)} className="px-4 py-2 bg-bg-sunken text-text-secondary text-xs font-bold rounded-[var(--radius-button)] hover:bg-border transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddTask(true)} className="w-full flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors py-1 font-medium">
                <Plus className="w-4 h-4" /> Add todo, press ENTER to save
              </button>
            )}
          </div>

          {/* Task List */}
          <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] overflow-hidden flex-1 shadow-level-1">
            <div className="p-4 border-b border-border-light flex items-center justify-between bg-bg-canvas/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {view === 'unplanned' ? `Unplanned ${plannerTasks.filter(t=>t.status==='unplanned').length}` :
                 view === 'planned' ? 'Planned' : 'All Tasks'}
              </span>
            </div>

            {/* Done section */}
            {(view === 'all') && (
              <div className="px-4 py-2 border-b border-border-light bg-bg-sunken">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Done {plannerTasks.filter(t=>t.status==='done').length}</span>
              </div>
            )}

            <div className="divide-y divide-border-light overflow-hidden">
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 text-center text-xs text-text-muted font-medium">
                    {view === 'unplanned' ? 'No unplanned tasks! Great work.' : 'Nothing here.'}
                  </motion.div>
                ) : (
                  filteredTasks.map(task => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={task.id}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, task.id)}
                      className="flex items-center gap-3 p-4 hover:bg-bg-canvas transition-colors group cursor-grab active:cursor-grabbing border-b border-border-light last:border-b-0"
                    >
                      <div className="text-text-muted/30 group-hover:text-text-muted/60 flex-shrink-0 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <button onClick={() => updatePlannerTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                        className={`w-5 h-5 rounded-[var(--radius-badge)] border flex-shrink-0 flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-brand border-brand' : 'border-border hover:border-brand'}`}>
                        {task.status === 'done' && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${task.status === 'done' ? 'line-through text-text-muted' : 'text-text-primary font-medium'}`}>{task.title}</span>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-[var(--radius-badge)] border ${getCategoryColor(task.category as PlannerCategory)}`}>
                              {task.category}
                            </span>
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getCategoryDotColor(task.category as PlannerCategory, task.color) }} />
                          </div>
                          {task.scheduledDate && (
                            <span className="text-[10px] text-text-secondary flex items-center gap-1.5 ml-1 whitespace-nowrap">
                              <Calendar className="w-3 h-3 text-text-muted" />
                              {task.scheduledDate} {task.scheduledTime || ''}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-[var(--radius-badge)] flex-shrink-0 ${getStatusColor(task.status)}`}>{task.status}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button className="p-1 hover:text-brand transition-colors text-text-muted/70" title="Schedule">
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deletePlannerTask(task.id)} className="p-1 hover:text-error-text transition-colors text-text-muted/70" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT: Calendar + Todo Detail */}
        <div className="col-span-7 flex flex-col gap-4">
          {/* Clock widget */}
          <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-5 flex items-center gap-6 shadow-level-1">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="var(--color-bg-elevated)" stroke="var(--color-border)" strokeWidth="2" />
                {[12,1,2,3,4,5,6,7,8,9,10,11].map((_, i) => {
                  const angle = (i * 30 - 90) * Math.PI / 180;
                  const x = 50 + 35 * Math.cos(angle);
                  const y = 50 + 35 * Math.sin(angle);
                  return <circle key={i} cx={x} cy={y} r="2" fill="var(--color-border)" />;
                })}
                {/* Hour hand */}
                <line x1="50" y1="50" x2={50 + 20 * Math.cos((today.getHours() * 30 + today.getMinutes() * 0.5 - 90) * Math.PI / 180)}
                  y2={50 + 20 * Math.sin((today.getHours() * 30 + today.getMinutes() * 0.5 - 90) * Math.PI / 180)}
                  stroke="var(--color-text-primary)" strokeWidth="3" strokeLinecap="round" />
                {/* Minute hand */}
                <line x1="50" y1="50" x2={50 + 28 * Math.cos((today.getMinutes() * 6 - 90) * Math.PI / 180)}
                  y2={50 + 28 * Math.sin((today.getMinutes() * 6 - 90) * Math.PI / 180)}
                  stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="50" r="3" fill="var(--color-text-primary)" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-text-primary">
                {String(today.getHours()).padStart(2,'0')}:{String(today.getMinutes()).padStart(2,'0')}
                <span className="text-base font-normal text-text-muted ml-1">{today.getHours() < 12 ? 'am' : 'pm'}</span>
              </div>
              <div className="text-sm text-text-secondary font-medium mt-1">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][today.getDay() === 0 ? 6 : today.getDay() - 1]}, {today.getDate()}{today.getDate() === 1 ? 'st' : today.getDate() === 2 ? 'nd' : today.getDate() === 3 ? 'rd' : 'th'} {MONTHS[today.getMonth()]}
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Today's Tasks</div>
              <div className="text-2xl font-bold text-text-primary">{plannerTasks.filter(t => t.scheduledDate === todayStr).length}</div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-5 shadow-level-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-text-primary">{MONTHS[currentMonth]} {currentYear}</h3>
                {calendarConnections.some(c => c.provider === 'google') ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-info/10 border border-info/20 rounded-[var(--radius-chip)] text-[10px] font-bold text-info">
                    <LinkIcon className="w-3 h-3" /> Connected
                  </div>
                ) : (
                  <button 
                    onClick={() => connectCalendar('google')}
                    className="flex items-center gap-1.5 px-2 py-1 bg-bg-sunken hover:bg-bg-canvas border border-border rounded-[var(--radius-chip)] text-[10px] font-bold text-text-secondary transition-colors"
                  >
                    <LinkIcon className="w-3 h-3" /> Connect
                  </button>
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="w-7 h-7 rounded-[var(--radius-chip)] hover:bg-bg-sunken flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-4 h-4 text-text-secondary" />
                </button>
                <button onClick={nextMonth} className="w-7 h-7 rounded-[var(--radius-chip)] hover:bg-bg-sunken flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => <div key={d} className="text-[10px] font-bold text-center text-text-muted uppercase tracking-wider py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dateStr = getDateStr(day);
                const isToday = dateStr === todayStr;
                const isSelected = selectedDate === dateStr;
                const dayTasks = tasksOnDate(day);
                const dayExternalEvents = externalEvents.filter(e => e.startDate === dateStr);
                
                return (
                  <div key={day}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dateStr)}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`relative p-2 rounded-[var(--radius-card-inner)] text-sm font-medium transition-all text-center cursor-pointer min-h-[40px] flex flex-col items-center justify-start
                      ${isSelected ? 'bg-brand text-text-inverse shadow-level-1' : isToday ? 'bg-text-primary text-text-inverse' : 'hover:bg-bg-sunken text-text-primary border border-transparent hover:border-brand/30'}`}
                  >
                    <span>{day}</span>
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center max-w-full px-1">
                      {dayTasks.map((t, idx) => (
                        <div key={t.id} className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: isSelected || isToday ? 'rgba(255,255,255,0.8)' : getCategoryDotColor(t.category, t.color) }} title={t.title} />
                      ))}
                      {dayExternalEvents.map((e, idx) => (
                        <div key={e.id} className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ backgroundColor: isSelected || isToday ? 'rgba(255,255,255,0.5)' : '#4285F4' }} title={e.title} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected date tasks */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-bg-elevated border border-border rounded-[var(--radius-card)] overflow-hidden shadow-level-1 mt-2"
              >
                <div className="p-4 border-b border-border-light flex items-center justify-between bg-bg-canvas/50">
                  <span className="text-sm font-semibold text-text-primary">Tasks for {selectedDate}</span>
                  <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-bg-sunken rounded-[var(--radius-chip)] transition-colors">
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </div>
                {selectedDateTasks.length === 0 && externalEvents.filter(e => e.startDate === selectedDate).length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-muted font-medium">No tasks or events scheduled for this day.</div>
                ) : (
                  <div className="divide-y divide-border-light max-h-[300px] overflow-y-auto">
                    {selectedDateTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-4 hover:bg-bg-canvas transition-colors">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-text-primary font-medium">{task.title}</span>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-[var(--radius-badge)] border ${getCategoryColor(task.category as PlannerCategory)}`}>
                                {task.category}
                              </span>
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getCategoryDotColor(task.category, task.color) }} />
                            </div>
                            {task.scheduledTime && (
                              <span className="text-[10px] text-text-secondary whitespace-nowrap ml-1">{task.scheduledTime}</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-[var(--radius-badge)] ${getStatusColor(task.status)}`}>{task.status}</span>
                      </div>
                    ))}
                    {externalEvents.filter(e => e.startDate === selectedDate).map(e => (
                      <div key={e.id} className="flex items-center gap-3 p-4 bg-info/5 opacity-90 border-l-2 border-info">
                        <div className="w-1.5 h-1.5 rounded-sm flex-shrink-0 bg-info" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-text-primary font-medium">{e.title}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-[var(--radius-badge)] border border-info/20 text-info bg-info/10">
                              Google Calendar
                            </span>
                            {e.startTime && <span className="text-[10px] text-text-muted">{e.startTime}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Todos section */}
          <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] overflow-hidden shadow-level-1">
            <div className="p-4 border-b border-border-light bg-bg-canvas/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Todo's</span>
            </div>
            {/* Summary rows */}
            <div className="divide-y divide-border-light">
              {[
                { label: 'Unplanned', count: plannerTasks.filter(t=>t.status==='unplanned').length, color: 'text-text-muted' },
                { label: 'Todo', count: plannerTasks.filter(t=>t.status==='todo').length, color: 'text-warning-text' },
                { label: 'Scheduled', count: plannerTasks.filter(t=>t.status==='scheduled').length, color: 'text-info-text' },
                { label: 'Done', count: plannerTasks.filter(t=>t.status==='done').length, color: 'text-success-text' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3 hover:bg-bg-canvas transition-colors cursor-pointer" onClick={() => setView(row.label.toLowerCase() === 'unplanned' ? 'unplanned' : row.label.toLowerCase() === 'done' ? 'all' : 'planned')}>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-text-muted/50" />
                    <span className={`text-sm font-medium ${row.color}`}>{row.label}</span>
                  </div>
                  <span className="text-sm font-bold text-text-primary">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
