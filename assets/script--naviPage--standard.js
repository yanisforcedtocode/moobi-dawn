'use strict'
// ============== data ==============//
const bumperProblems = [
    {
      src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/c_scar_01_p01.jpg?v=1634185929",
      name: "淺花痕",
      data: "light-scratching",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/c_scar_01_p02.jpg?v=1634185929",
      name: "脫漆傷痕",
      data: "surface-scratches",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/c_scar_01_p03.jpg?v=1634185929",
      name: "線紋傷痕",
      data: "linear-scratches",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/c_scar_01_p04.jpg?v=1634185929s",
      name: "深刻傷痕",
      data: "deep-scratches",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/decoloration_265x_e935369d-2575-4a2d-bac5-28083a8df945.jpg?v=1646368453",
      name: "褪色老化",
      data: "褪色老化",
    },
  ];
  
  const bodyProblems = [
    {
      src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/c_scar_02_p01.jpg?v=1634185883",
      name: "淺痕及太陽紋",
      data: "",
    },
    { src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/c_scar_02_p02.jpg?v=1634185883", name: "線紋傷痕", data: "" },
    { src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/c_scar_02_p03.jpg?v=1634185883", name: "凹痕", data: "" },
  ];
  
  const wheelsProblems = [
    {
      src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/c_scar_04_p03.jpg?v=1634186002",
      name: "剎車碟塵漬硬化",
      data: "",
    },
    { src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/c_scar_04_p02.jpg?v=1634186002", name: "花痕", data: "" },
  ];
  const glassProblems = [
    { src: "https://cdn.shopify.com/s/files/1/0046/0990/0618/files/foggy_headlight.jpg?v=1651813814", name: "車頭燈老化", data: "" },
  ];
  
  // ============== selected elements ==============//
  let selectedPart = ""
  const problemsGrid = document.querySelector(
    ".repairNavi__problemSelector__section__container__grid"
  );
  const problemsGridNode = document.getElementById("problemSelectorGrid");
  const partsGrid = document.querySelector(
    ".repairNavi__partSelector__section__container__grid"
  );
  const problemContainer = document.querySelector(
    ".repairNavi__problemSelector__section__container"
  );
  const problemsContNode = document.getElementById("problemSelectorContainer");
  const solutionsGridContNode = document.getElementById("solutionsGridsCont")
  const solutionSelector = document.getElementById("solutionSelector")
  

  const parser = new DOMParser()
  // remove extra result images (fix a bug)
  const removeResImg = function(){
    const resImgs = document.querySelectorAll(".repairNavi__solutionSelector__section__container__imgWrapper")
    resImgs? resImgs.forEach((el)=>{el.remove()}):""

  }

  // Handler to insert main article img
  const addArticleImg = async function(){try{
    // get last solution grid
    //const solutionGrids = document.getElementsByClassName("repairNavi__solutionSelector__section__container__grid")
    const gridCont = document.querySelector(".repairNavi__solutionSelector__section__container")
    const gridAs = gridCont.querySelectorAll("a")
    // get the ahref from the last solution grid
    const link = gridAs[gridAs.length-1].href
    console.log(link)
    // fetch the ahref and get element by id "articleMainImg"
    const res = await fetch(link)
    const text = await res.text()
    const newDom = parser.parseFromString(text,"text/html")
    console.log(newDom)
    const imgUrl = newDom.querySelector("#articleMainImg").dataset.img
    //console.log(imgUrl)
    // append the img
    const imgWrapper = document.createElement("div")
    imgWrapper.classList.add("repairNavi__solutionSelector__section__container__imgWrapper")
    const imgH3 = document.createElement("h3")
    imgH3.innerText = "修補效果"
    const imgElm = document.createElement("img")
    imgElm.src = imgUrl
    imgWrapper.appendChild(imgH3)
    imgWrapper.appendChild(imgElm)
    removeResImg()
    solutionsGridContNode.appendChild(imgWrapper)
    }catch(error){console.log(error)}
  }

  // ============== parts selector ==============//
  const createProblemsElm = function (data, type) {
   
    const elm = document.createElement(type);
    elm.classList.add(
      "repairNavi__problemSelector__section__container__grid__col"
    );
    elm.dataset.problem = data.name;
    elm.id = "li-" + Math.floor(Math.random() * 9999);
    const h3 = document.createElement("h3");
    h3.innerText = data.name;
    const img = document.createElement("img");
    img.src = data.src;
    elm.appendChild(img);
    elm.appendChild(h3);
    return elm;
  };
  
  const insertProblemsElms = function (problem) {
    problem.forEach((el) => {
      problemsGridNode.appendChild(createProblemsElm(el, "div"));
    });
  };
  
  const insertTheProblemElms = function (part) {
    part === "Bumper" ? insertProblemsElms(bumperProblems) : "";
    part === "Body" ? insertProblemsElms(bodyProblems) : "";
    part === "Wheel" ? insertProblemsElms(wheelsProblems) : "";
    part === "Glass" ? insertProblemsElms(glassProblems) : "";

    //Glass problems to be lived in future updates
    //part === "Glass" ? insertProblemsElms(glassProblems) : "";
  };
  
  const returnChosenPart = function (parts) {
    let i = 0;
    let found = "false";
    let part = "";
    while (found === "false") {
      if (typeof parts[i].dataset.part !== "undefined") {
        found = "true";
        part = parts[i].dataset.part;
      }
      i = i + 1;
    }
    return part;
  };
  const problemGridStyleChanges = function () {
    while (problemsGridNode.firstChild) {
      problemsGridNode.removeChild(problemsGridNode.lastChild);
    }
    problemsGrid.style.maxHeight = "500px";
    problemsGrid.classList.remove("problemsAnimation");
    problemsGrid.style.opacity = "0%";
    setTimeout(function () {
      problemsGrid.classList.add("problemsAnimation");
    }, 0);
  };
  const SolutionGridStyleChanges = function () {
    while (solutionsGridContNode.firstChild) {
      solutionsGridContNode.removeChild(solutionsGridContNode.lastChild);
    }
    solutionsGridContNode.classList.remove("problemsAnimation");
    solutionsGridContNode.style.opacity = "0%";
    setTimeout(function () {
      solutionsGridContNode.classList.add("problemsAnimation");
    }, 0);
  };
  partsGrid.addEventListener("click", (e) => {
    problemGridStyleChanges();
    SolutionGridStyleChanges();
    const path = e.composedPath();
    let part = returnChosenPart(path);
    //console.log(part);
    selectedPart = part
    insertTheProblemElms(part);
  });
  // ============== problems selector ==============//
  const returnChosenProblem = function (problems) {
    let i = 0;
    let found = "false";
    let problem = "";
    while (found === "false" && i < 2) {
      if (typeof problems[i].dataset.problem !== "undefined") {
        found = "true";
        problem = problems[i].dataset.problem;
      }
      i = i + 1;
    }
    //console.log(problem)
    return problem;
  };
  const queryRepairDB = async function(query){
    let root = "https://moobinavi.df.r.appspot.com/api/v00/solutions"
    let url = root+query
    try{
    const res = await fetch(url)
    const data = await res.json()
    const navis = data.data.navis
    //console.log(data.data.navis)
    return navis
    }catch(err){
      console.log(err)
    }
  }
  const insertSolutionIndex = function(){
    const grid = document.createElement("div")
    grid.classList.add(
      "repairNavi__solutionSelector__section__container__grid","container__grid--first"
    );
  
    const title = document.createElement("p")
    title.innerText = "解決方案"
    const time = document.createElement("p")
    time.innerText = "時間"
    const difficulty = document.createElement("p")
    difficulty.innerText = "難度"
    const price = document.createElement("p")
    price.innerText = "預算"
    grid.append(title, time, difficulty, price)
    solutionsGridContNode.appendChild(grid)
  }
  const createSolutionsElm = function (data) {
    const link = document.createElement("a")
    link.href = `/blogs/${data.articleHandle}`
    const elm = document.createElement("div");
    elm.classList.add(
      "repairNavi__solutionSelector__section__container__grid"
    );
    elm.dataset.solution = data.part+data.problem+data.title;
    const title = document.createElement("p");
    title.innerText = data.title;
    const time = document.createElement("p");
    time.innerText = `${data.time} 分鐘`
    
    const difficulty = document.createElement("div");
  
  
    for (let i=0; i< Number(data.difficulty); i++){
      //console.log(Number(data.difficulty))
      const star = document.createElement("i");    
      star.classList.add("fas")
      star.classList.add("fa-star")
      difficulty.appendChild(star)
    }
  
    const price = document.createElement("p");
    price.innerText = `約: $${data.price}`
    elm.append(title, time, difficulty, price)
    link.appendChild(elm)
    //console.log(link)
  
    return link;
  };
  
  const insertSolutionsElms = function (data) {
    data.forEach((el) => {
      solutionsGridContNode.appendChild(createSolutionsElm(el));
    });
  };
  
  problemsGridNode.addEventListener("click", (e) => {
    const path = e.composedPath();
    let query = `?part=${selectedPart}&problem=${returnChosenProblem(path)}`
    // GTM installation
    if(typeof gTagHandler_external!== 'undefined'){
      gTagHandler_external(
        "naviPage_engagement",
        [
          {
            key: "naviPage_engagement_problem",
            value: returnChosenProblem(path),
          },
          { key: "naviPage_engagement_part", value: selectedPart },
          { key: "type", value: "naviPage_navi_widget" },
        ],
        { dev: false }
      );
    }
    // end of GTM
    const data = queryRepairDB(query).then((data)=>{
      SolutionGridStyleChanges()
      insertSolutionIndex()
      insertSolutionsElms(data)
      solutionSelector.scrollIntoView(true)
      addArticleImg()
    })
  });
  