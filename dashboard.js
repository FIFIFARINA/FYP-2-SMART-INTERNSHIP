(() => {
  const role = sessionStorage.getItem("sim_user_role");
  if (role !== "student") { window.location.replace("index.html"); return; }
  const username = sessionStorage.getItem("sim_username") || "Student";
  document.getElementById("welcomeName").textContent = username;
  const key = "sim_data_" + username.toLowerCase();
  const load = () => { try { return JSON.parse(localStorage.getItem(key)) || {attendance:[],logbooks:[],reminders:[]}; } catch { return {attendance:[],logbooks:[],reminders:[]}; } };
  const save = data => localStorage.setItem(key, JSON.stringify(data));
  const today = new Date().toISOString().slice(0,10);
  document.getElementById("todayDate").textContent = new Date().toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const modal = document.getElementById("attendanceModal");
  const attendanceText = document.getElementById("attendanceModalText");
  const attendanceMsg = document.getElementById("attendanceMessage");
  function render() {
    const d=load();
    document.getElementById("attendanceCount").textContent = `${d.attendance.length} day${d.attendance.length===1?"":"s"}`;
    document.getElementById("logbookCount").textContent = `${d.logbooks.length} submitted`;
    document.getElementById("attendanceProgress").style.width = `${Math.min(100,d.attendance.length/120*100)}%`;
    document.getElementById("logbookProgress").style.width = `${Math.min(100,d.logbooks.length/24*100)}%`;
    const p=Math.min(100,Math.round((d.attendance.length/120*60)+(d.logbooks.length/24*40)));
    document.getElementById("overallProgress").style.width = `${p}%`;
    document.getElementById("progressStatus").textContent = p>=75?"On Track":p>=30?"In Progress":"Just Started";
    document.getElementById("markAttendance").disabled = d.attendance.includes(today);
    attendanceText.textContent = d.attendance.includes(today) ? "Your attendance has already been marked for today." : "Confirm your attendance for today.";
    attendanceMsg.textContent = d.attendance.includes(today) ? "Present recorded for today." : "";
    document.getElementById("logbookMessage").textContent = d.logbooks.length ? `Last submission: ${d.logbooks[d.logbooks.length-1].name}` : "";
    const list=document.getElementById("reminderList"); list.innerHTML="";
    document.getElementById("reminderEmpty").hidden=d.reminders.length>0;
    d.reminders.sort((a,b)=>a.time.localeCompare(b.time)).forEach((r,i)=>{
      const li=document.createElement("li"); li.className=r.done?"completed":"";
      const cb=document.createElement("input"); cb.type="checkbox"; cb.checked=!!r.done; cb.setAttribute("aria-label","Mark activity complete"); cb.addEventListener("change",()=>{const x=load();x.reminders[i].done=cb.checked;save(x);render();});
      const content=document.createElement("div");content.className="reminder-item-content";
      const title=document.createElement("span");title.className="reminder-item-title";title.textContent=r.title;
      const meta=document.createElement("span");meta.className="reminder-item-meta";meta.textContent=r.time;
      content.append(title,meta); const del=document.createElement("button");del.className="reminder-delete";del.type="button";del.textContent="×";del.setAttribute("aria-label","Delete reminder");del.addEventListener("click",()=>{const x=load();x.reminders.splice(i,1);save(x);render();});
      li.append(cb,content,del);list.append(li);
    });
  }
  document.getElementById("attendanceCard").addEventListener("click",()=>{modal.hidden=false;});
  document.getElementById("closeAttendance").addEventListener("click",()=>modal.hidden=true);
  modal.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true;});
  document.getElementById("markAttendance").addEventListener("click",()=>{const d=load();if(!d.attendance.includes(today))d.attendance.push(today);save(d);render();});
  document.getElementById("logbookFile").addEventListener("change",e=>{document.getElementById("logbookFileName").textContent=e.target.files[0]?.name||"Choose a file (PDF, DOC, DOCX)";});
  document.getElementById("logbookForm").addEventListener("submit",e=>{e.preventDefault();const file=document.getElementById("logbookFile").files[0];if(!file)return;const d=load();d.logbooks.push({name:file.name,date:today});save(d);e.target.reset();document.getElementById("logbookFileName").textContent="Choose a file (PDF, DOC, DOCX)";render();document.getElementById("logbookMessage").textContent=`Logbook #${d.logbooks.length} recorded: ${file.name}`;});
  document.getElementById("reminderForm").addEventListener("submit",e=>{e.preventDefault();const d=load();d.reminders.push({time:document.getElementById("reminderTime").value,title:document.getElementById("reminderTitle").value.trim(),done:false});save(d);e.target.reset();render();});
  document.getElementById("logoutButton").addEventListener("click",()=>{sessionStorage.clear();window.location.href="index.html";});
  render();
})();