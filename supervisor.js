(() => {
  const role=sessionStorage.getItem("sim_user_role");
  if(!["supervisor","admin"].includes(role)){window.location.replace("index.html");return;}
  document.getElementById("roleLabel").textContent=role==="admin"?"Admin access":"Supervisor access";
  const students=[{name:"Ali Ahmad",attendance:18,logbooks:8,status:"On Track",performance:92},{name:"Siti Aisyah",attendance:15,logbooks:7,status:"In Progress",performance:78},{name:"Amir Hakim",attendance:10,logbooks:4,status:"Needs Improvement",performance:61}];
  const body=document.getElementById("progressTableBody");
  students.forEach(s=>{const tr=document.createElement("tr");[s.name,`${s.attendance} days`,`${s.logbooks} submitted`,s.status].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.append(td);});body.append(tr);});
  document.getElementById("recentEntry").textContent="Ali Ahmad · Weekly logbook · Submitted recently (sample data)";
  const list=document.getElementById("performanceList");
  students.forEach(s=>{const item=document.createElement("article");item.className="performance-item";const head=document.createElement("div");head.className="performance-item-heading";const name=document.createElement("strong");name.textContent=s.name;const pct=document.createElement("strong");pct.textContent=`${s.performance}%`;head.append(name,pct);const track=document.createElement("div");track.className="performance-track";const fill=document.createElement("div");fill.className="performance-fill";fill.style.width=`${s.performance}%`;track.append(fill);const status=document.createElement("p");status.textContent=s.performance>=90?"Excellent Progress":s.performance>=75?"Good Progress":"Needs Follow-up";item.append(head,track,status);list.append(item);});
  document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b===btn));document.querySelectorAll(".panel").forEach(p=>{p.hidden=p.id!==btn.dataset.tab;p.classList.toggle("active-panel",p.id===btn.dataset.tab);});}));
  document.getElementById("logoutButton").addEventListener("click",()=>{sessionStorage.clear();window.location.href="index.html";});
})();