const $ = (id) => document.getElementById(id);
const numbersInput = $("numbersInput"), categorySelect = $("categorySelect"), algorithmSelect = $("algorithmSelect"), targetInput = $("targetInput"), targetWrap = $("targetWrap"), visualization = $("visualization"), message = $("message");
let values = [], steps = [], stepIndex = -1;
const algorithms = {
linear:{title:"Linear Search",time:"O(n)",space:"O(1)",note:"Checks each item from left to right until the target is found or the list ends.",code:`function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`},
binary:{title:"Binary Search",time:"O(log n)",space:"O(1)",note:"Repeatedly halves a sorted list. This visualizer sorts a copy first.",code:`function binarySearch(arr, target) {
  arr = [...arr].sort((a, b) => a - b);
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`},
bubble:{title:"Bubble Sort",time:"O(n²)",space:"O(1)",note:"Compares neighboring values and swaps them when they are in the wrong order.",code:`function bubbleSort(arr) {
  arr = [...arr];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`},
selection:{title:"Selection Sort",time:"O(n²)",space:"O(1)",note:"Finds the smallest value in the unsorted part and moves it to the front.",code:`function selectionSort(arr) {
  arr = [...arr];
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}`}
};
function parseValues(){
  const raw=numbersInput.value.trim();
  if(!raw) throw new Error("Enter at least one number.");
  const parts=raw.split(",").map(s=>s.trim());
  if(parts.some(s=>s===""||!Number.isFinite(Number(s)))) throw new Error("Use numbers separated by commas, for example: 8, 3, 12, 5.");
  const nums=parts.map(Number);
  if(nums.length>30) throw new Error("Please use 30 numbers or fewer for a clear visualization.");
  return nums;
}
function setMessage(text,isError=false){message.textContent=text;message.classList.toggle("error",isError);}
function updateAlgorithmOptions(){
  const search=categorySelect.value==="search";
  algorithmSelect.innerHTML=search?'<option value="linear">Linear Search</option><option value="binary">Binary Search</option>':'<option value="bubble">Bubble Sort</option><option value="selection">Selection Sort</option>';
  targetWrap.hidden=!search;renderInfo();resetVisualization();
}
function renderInfo(){
  const info=algorithms[algorithmSelect.value];
  $("visualTitle").textContent=info.title;$("timeComplexity").textContent=info.time;$("spaceComplexity").textContent=info.space;$("complexityNote").textContent=info.note;$("sourceCode").textContent=info.code;
}
function resetVisualization(){
  try{values=parseValues();steps=[];stepIndex=-1;renderBars(values);$("stepCounter").textContent="Step 0";setMessage("Ready. Press Run algorithm to begin.");}
  catch(error){visualization.innerHTML="";setMessage(error.message,true);}
}
function renderBars(arr,state={}){
  const active=state.active||[],found=state.found||[],checked=state.checked||[];
  visualization.innerHTML="";
  const max=Math.max(...arr.map(v=>Math.abs(v)),1);
  arr.forEach((value,index)=>{
    const wrap=document.createElement("div");wrap.className="bar-wrap";
    const bar=document.createElement("div");bar.className="bar";
    if(found.includes(index))bar.classList.add("found");else if(active.includes(index))bar.classList.add("active");else if(checked.includes(index))bar.classList.add("checked");
    bar.style.height=Math.max(28,Math.round(Math.abs(value)/max*145))+"px";bar.textContent=String(value);bar.title=`Index ${index}: ${value}`;
    const idx=document.createElement("span");idx.className="bar-index";idx.textContent="Index "+index;wrap.append(bar,idx);visualization.append(wrap);
  });
}
function buildSteps(){
  const input=parseValues(),target=Number(targetInput.value),list=[],algo=algorithmSelect.value;
  if(algo==="linear"){
    for(let i=0;i<input.length;i++){
      list.push({values:[...input],active:[i],checked:Array.from({length:i},(_,k)=>k),text:`Checking index ${i}: ${input[i]}.`});
      if(input[i]===target){list.push({values:[...input],found:[i],checked:Array.from({length:i},(_,k)=>k),text:`Found ${target} at index ${i}!`});return list;}
    }
    list.push({values:[...input],checked:input.map((_,i)=>i),text:`${target} was not found in the list.`});
  }else if(algo==="binary"){
    const sorted=[...input].sort((a,b)=>a-b);let left=0,right=sorted.length-1;
    while(left<=right){
      const mid=Math.floor((left+right)/2);
      list.push({values:[...sorted],active:[mid],checked:sorted.map((_,i)=>i).filter(i=>i<left||i>right),text:`Search range: indexes ${left}–${right}. Checking middle index ${mid} (${sorted[mid]}).`});
      if(sorted[mid]===target){list.push({values:[...sorted],found:[mid],checked:sorted.map((_,i)=>i).filter(i=>i<left||i>right),text:`Found ${target} at index ${mid} in the sorted list.`});return list;}
      if(sorted[mid]<target)left=mid+1;else right=mid-1;
    }
    list.push({values:[...sorted],checked:sorted.map((_,i)=>i),text:`${target} was not found in the sorted list.`});
  }else if(algo==="bubble"){
    const arr=[...input];list.push({values:[...arr],text:"Starting Bubble Sort."});
    for(let i=0;i<arr.length;i++)for(let j=0;j<arr.length-i-1;j++){
      list.push({values:[...arr],active:[j,j+1],text:`Compare ${arr[j]} and ${arr[j+1]}.`});
      if(arr[j]>arr[j+1]){[arr[j],arr[j+1]]=[arr[j+1],arr[j]];list.push({values:[...arr],active:[j,j+1],text:`Swap them. Values are now ${arr[j]} and ${arr[j+1]}.`});}
    }
    list.push({values:[...arr],found:arr.map((_,i)=>i),text:"Bubble Sort complete!"});
  }else{
    const arr=[...input];list.push({values:[...arr],text:"Starting Selection Sort."});
    for(let i=0;i<arr.length;i++){
      let min=i;
      for(let j=i+1;j<arr.length;j++){
        list.push({values:[...arr],active:[min,j],checked:Array.from({length:i},(_,k)=>k),text:`Current minimum is ${arr[min]}; compare it with ${arr[j]}.`});
        if(arr[j]<arr[min])min=j;
      }
      [arr[i],arr[min]]=[arr[min],arr[i]];
      list.push({values:[...arr],active:[i,min],found:Array.from({length:i},(_,k)=>k),text:`Place ${arr[i]} at sorted index ${i}.`});
    }
    list.push({values:[...arr],found:arr.map((_,i)=>i),text:"Selection Sort complete!"});
  }
  return list;
}
function showStep(index){
  if(!steps.length)return;stepIndex=Math.max(0,Math.min(index,steps.length-1));const step=steps[stepIndex];
  renderBars(step.values,step);$("stepCounter").textContent=`Step ${stepIndex+1} / ${steps.length}`;setMessage(step.text);
}
function runAlgorithm(){
  try{values=parseValues();if(categorySelect.value==="search"&&targetInput.value.trim()==="")throw new Error("Enter a target number to search for.");steps=buildSteps();if(!steps.length)throw new Error("No steps could be created.");showStep(0);}
  catch(error){setMessage(error.message,true);}
}
$("runBtn").addEventListener("click",runAlgorithm);
$("stepBtn").addEventListener("click",()=>{if(!steps.length){setMessage("Press Run algorithm first.");return;}if(stepIndex>=steps.length-1){setMessage("You are at the final step. Press Run algorithm to start again.");return;}showStep(stepIndex+1);});
$("resetBtn").addEventListener("click",resetVisualization);
$("randomBtn").addEventListener("click",()=>{const nums=Array.from({length:7},()=>Math.floor(Math.random()*49)+1);numbersInput.value=nums.join(", ");targetInput.value=nums[3];resetVisualization();});
categorySelect.addEventListener("change",updateAlgorithmOptions);
algorithmSelect.addEventListener("change",()=>{renderInfo();resetVisualization();});
numbersInput.addEventListener("change",resetVisualization);
targetInput.addEventListener("change",()=>{if(categorySelect.value==="search")resetVisualization();});
$("copyBtn").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText($("sourceCode").textContent);$("copyMessage").textContent="Code copied to clipboard.";}
  catch{$("copyMessage").textContent="Copy is not supported in this browser. Select the code and copy it manually.";}
});
updateAlgorithmOptions();