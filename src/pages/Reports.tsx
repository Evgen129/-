import { useState, useEffect, useRef } from 'react';
import { API, Defect, WorkCard, User } from '../lib/db';
import { Download } from 'lucide-react';

export function Reports() {
  const [users, setUsers] = useState<User[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [cards, setCards] = useState<WorkCard[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [selectedUser, setSelectedUser] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    Promise.all([
      API.getAllUsers(),
      API.getAllDefects(),
      API.getAllCards()
    ]).then(([u, d, c]) => {
      setUsers(u);
      setDefects(d);
      setCards(c);
      drawChart(u, d, c, selectedMonth);
    });
  }, [selectedMonth]);

  const drawChart = (u: User[], d: Defect[], c: WorkCard[], month: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Filter by month
    const m = month.split('-')[1];
    const y = month.split('-')[0];
    
    const dFiltered = d.filter(item => item.date.startsWith(`${y}-${m}`));
    const cFiltered = c.filter(item => item.date.startsWith(`${y}-${m}`));

    // Aggregate by user
    const stats: Record<string, number> = {};
    u.forEach(user => {
      let count = 0;
      count += dFiltered.filter(df => df.mechanicName === user.name).length;
      count += cFiltered.filter(cf => cf.performers.includes(user.name)).length;
      stats[user.name] = count;
    });

    // Draw
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const PADDING = 40;
    const chartWidth = width - PADDING * 2;
    const chartHeight = height - PADDING * 2;
    
    const maxVal = Math.max(...Object.values(stats), 5); // at least 5 for scale
    
    // Axes
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(PADDING, PADDING);
    ctx.lineTo(PADDING, height - PADDING);
    ctx.lineTo(width - PADDING, height - PADDING);
    ctx.stroke();

    const names = Object.keys(stats);
    const barWidth = (chartWidth / names.length) * 0.6;
    const spacing = (chartWidth / names.length);

    names.forEach((name, i) => {
      const val = stats[name];
      const h = (val / maxVal) * chartHeight;
      const x = PADDING + (i * spacing) + (spacing - barWidth) / 2;
      const yPos = height - PADDING - h;

      // Bar
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x, yPos, barWidth, h);

      // Label (name)
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      // simplified display name
      const shortName = name.split(' ')[0] || 'Unknown';
      ctx.fillText(shortName, x + barWidth/2, height - PADDING + 15);

      // Label (value)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(val.toString(), x + barWidth/2, yPos - 5);
    });
  };

  const generateCSV = () => {
    let csv = 'Тип,Номер,Дата,Борт,Исполнитель/Техник\n';
    
    const m = selectedMonth.split('-')[1];
    const y = selectedMonth.split('-')[0];
    
    defects.filter(d => d.date.startsWith(`${y}-${m}`) && (!selectedUser || d.mechanicName === selectedUser)).forEach(d => {
      csv += `Дефект,${d.number},${d.date},${d.board},${d.mechanicName}\n`;
    });
    cards.filter(c => c.date.startsWith(`${y}-${m}`) && (!selectedUser || c.performers.includes(selectedUser))).forEach(c => {
      csv += `Наряд,${c.number},${c.date},${c.board},"${c.performers.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ежемесячный отчёт</h1>
        <button onClick={generateCSV} className="flex items-center gap-2 rounded bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600">
          <Download className="h-4 w-4" /> Экспорт CSV
        </button>
      </div>

      <div className="mb-6 grid gap-4 grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">Месяц</label>
          <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700" />
        </div>
        <div>
          <label className="text-sm text-slate-400">Сотрудник (опц.)</label>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700">
            <option value="">Все сотрудники</option>
            {users.map(u => <option key={u.id} value={u.name}>{u.name} ({u.position})</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-4 font-semibold">Выработка по сотрудникам (ед. работ)</h3>
        <div className="w-full overflow-x-auto">
          <canvas ref={canvasRef} width={600} height={300} className="max-w-full" />
        </div>
      </div>
    </>
  );
}
