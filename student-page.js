(() => {
  if (sessionStorage.getItem("sim_user_role") !== "student") { window.location.replace("index.html"); return; }
  const username=sessionStorage.getItem("sim_username")||"Student";
  const key="sim_forms_"+username.toLowerCase();
  const get=()=>{try{return JSON.parse(localStorage.getItem(key))||{};}catch{return {};}};
  const save=x=>localStorage.setItem(key,JSON.stringify(x));
  function updateChecklist(){
    const s=get();
    [["feedback","feedbackChecklistStatus","feedbackDot","Not completed","Completed"],["release","releaseChecklistStatus","releaseDot","Not submitted","Submitted"],["notification","notificationChecklistStatus","notificationDot","Not submitted","Submitted"]].forEach(([k,label,dot,no,yes])=>{
      document.getElementById(label).textContent=s[k]?yes:no;
      document.getElementById(dot).classList.toggle("done",!!s[k]);
    });
  }
  document.getElementById("openFeedbackForm").addEventListener("click",()=>{
    const input=document.getElementById("feedbackFormLink"), status=document.getElementById("feedbackStatus");
    try { const u=new URL(input.value); if(!["http:","https:"].includes(u.protocol)) throw Error(); window.open(u.href,"_blank","noopener,noreferrer");const s=get();s.feedback=true;save(s);status.textContent="Google Form opened. Checklist marked completed; please ensure you submitted it.";updateChecklist(); }
    catch {status.textContent="Please enter a valid Google Form URL beginning with https://";}
  });
  [["releaseForm","releaseFile","releaseFileName","releaseStatus","release"],["notificationForm","notificationFile","notificationFileName","notificationStatus","notification"]].forEach(([formId,fileId,nameId,statusId,key])=>{
    const file=document.getElementById(fileId);
    file.addEventListener("change",()=>{document.getElementById(nameId).textContent=file.files[0]?.name||"Choose a file (PDF, DOC, DOCX, JPG, PNG)";});
    document.getElementById(formId).addEventListener("submit",e=>{e.preventDefault();if(!file.files[0])return;const s=get();s[key]={name:file.files[0].name,submittedAt:new Date().toISOString()};save(s);document.getElementById(statusId).textContent=`Marked as submitted: ${file.files[0].name} (prototype only)`;updateChecklist();});
  });
  document.getElementById("logoutButton").addEventListener("click",()=>{sessionStorage.clear();window.location.href="index.html";});
  updateChecklist();
})();