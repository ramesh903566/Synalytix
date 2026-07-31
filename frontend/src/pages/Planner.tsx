import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, ChevronLeft, ChevronRight, X, Check, Trash2 } from 'lucide-react';
import { useAppContext, PlannerTask } from '../context/AppContext';

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
  const { plannerTasks, addPlannerTask, updatePlannerTask, deletePlannerTask } = useAppContext();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<PlannerView>('unplanned');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('content');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskStatus, setNewTaskStatus] = useState<PlannerTask['status']>('unplanned');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

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
    if (view === 'unplanned') return t.status === 'unplanned';
    if (view === 'planned') return t.status === 'scheduled' || t.status === 'todo';
    return true;
  });

  const selectedDateTasks = selectedDate ? plannerTasks.filter(t => t.scheduledDate === selectedDate) : [];

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addPlannerTask({
      title: newTaskTitle,
      projectId: newTaskProject,
      status: newTaskDate ? 'scheduled' : newTaskStatus,
      scheduledDate: newTaskDate || undefined,
      scheduledTime: newTaskTime || undefined,
      priority: newTaskPriority,
    });
    setNewTaskTitle('');
    setNewTaskDate('');
    setNewTaskTime('');
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

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

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
          <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-2 shadow-level-1">
            {(['unplanned', 'planned', 'all'] as PlannerView[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-card-inner)] text-sm font-medium transition-all ${view === v ? 'bg-bg-sunken text-text-primary' : 'text-text-secondary hover:bg-bg-canvas'}`}>
                <span className={`w-5 h-5 rounded-[var(--radius-badge)] border flex items-center justify-center flex-shrink-0 transition-colors ${view === v ? 'border-brand bg-brand' : 'border-border'}`}>
                  {view === v && <Check className="w-3 h-3 text-white" />}
                </span>
                {v === 'unplanned' ? (
                  <span className="flex items-center gap-2 flex-1">
                    <span>Unplanned</span>
                    <span className="ml-auto text-xs font-bold bg-bg-canvas px-2 py-0.5 rounded-[var(--radius-badge)] text-text-muted border border-border-light">
                      {plannerTasks.filter(t => t.status === 'unplanned').length}
                    </span>
                    <ChevronRight className="w-4 h-4 text-text-muted/50" />
                  </span>
                ) : v === 'planned' ? (
                  <span className="flex items-center gap-2 flex-1">
                    <Check className="w-4 h-4 text-text-muted/50" /> Planned
                  </span>
                ) : (
                  <span className="flex items-center gap-2 flex-1">
                    <span className="text-base">≡</span> All
                  </span>
                )}
              </button>
            ))}
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
                <div className="grid grid-cols-2 gap-2">
                  <select value={newTaskProject} onChange={e => setNewTaskProject(e.target.value)}
                    className="text-xs p-2 bg-bg-canvas border border-border rounded-[var(--radius-chip)] outline-none text-text-primary">
                    <option value="content">Content</option>
                    <option value="dev">Development</option>
                    <option value="growth">Growth</option>
                    <option value="other">Other</option>
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

            <div className="divide-y divide-border-light">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted font-medium">
                  {view === 'unplanned' ? 'No unplanned tasks! Great work.' : 'Nothing here.'}
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-4 hover:bg-bg-canvas transition-colors group">
                    <button onClick={() => updatePlannerTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                      className={`w-5 h-5 rounded-[var(--radius-badge)] border flex-shrink-0 flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-brand border-brand' : 'border-border hover:border-brand'}`}>
                      {task.status === 'done' && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getPriorityDot(task.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm ${task.status === 'done' ? 'line-through text-text-muted' : 'text-text-primary font-medium'}`}>{task.title}</span>
                      {task.scheduledDate && (
                        <div className="text-[10px] text-text-secondary mt-0.5">{task.scheduledDate} {task.scheduledTime || ''}</div>
                      )}
                      {task.projectId && (
                        <div className="text-[9px] font-bold uppercase tracking-wider text-text-muted/70 mt-0.5">{task.projectId}</div>
                      )}
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-[var(--radius-badge)] flex-shrink-0 ${getStatusColor(task.status)}`}>{task.status}</span>
                    <button onClick={() => deletePlannerTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-error-text text-text-muted/50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
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
              <h3 className="text-sm font-semibold text-text-primary">{MONTHS[currentMonth]} {currentYear}</h3>
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
                return (
                  <button key={day} onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`relative p-2 rounded-[var(--radius-card-inner)] text-sm font-medium transition-all text-center ${isSelected ? 'bg-brand text-text-inverse shadow-level-1' : isToday ? 'bg-text-primary text-text-inverse' : 'hover:bg-bg-sunken text-text-primary'}`}>
                    {day}
                    {dayTasks.length > 0 && (
                      <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isSelected || isToday ? 'bg-white' : 'bg-brand'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected date tasks */}
          {selectedDate && (
            <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] overflow-hidden shadow-level-1">
              <div className="p-4 border-b border-border-light flex items-center justify-between bg-bg-canvas/50">
                <span className="text-sm font-semibold text-text-primary">Tasks for {selectedDate}</span>
                <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-bg-sunken rounded-[var(--radius-chip)] transition-colors">
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>
              {selectedDateTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-text-muted font-medium">No tasks scheduled for this day.</div>
              ) : (
                <div className="divide-y divide-border-light">
                  {selectedDateTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-4">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getPriorityDot(task.priority)}`} />
                      <span className="flex-1 text-sm text-text-primary font-medium">{task.title}</span>
                      {task.scheduledTime && <span className="text-xs text-text-muted">{task.scheduledTime}</span>}
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-[var(--radius-badge)] ${getStatusColor(task.status)}`}>{task.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
