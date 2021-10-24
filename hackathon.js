// get summary of favourite story and saving it as a JSON file.
// npm init -y
// npm install puppeteer 
// run-> node hackathon.js


let fs = require("fs");
let pupp = require("puppeteer");


let tab
let textt = []
let tabNew

async function main(){

    let browser = await pupp.launch({
        headless : false,
        defaultViewport : false,
    })
    let page = await browser.pages()
    tab = page[0]

    await tab.goto("https://archiveofourown.org")

    await tab.waitForTimeout(6000);


    tab.click("#tos_agree");
    

    await tab.waitForSelector("#accept_tos")
    tab.click("#accept_tos")
    
 
    await tab.waitForSelector(".browse.module ul li a")
    let category = await tab.$$(".browse.module ul li a")
    let categoryClicked = await tab.evaluate(function(ele){
        return ele.getAttribute("href")
    }, category[0])
    

    tab.goto("https://archiveofourown.org/" + categoryClicked)


    await tab.waitForSelector(".media.fandom.index.group li p a")
    let genere = await tab.$$(".media.fandom.index.group li p a")
    let genereClickd = await tab.evaluate(function(ele){
        return ele.getAttribute("href")
    }, genere[1])
    
    tab.goto("https://archiveofourown.org/" + genereClickd)


    await tab.waitForSelector(".alphabet.fandom.index.group li ul li a")
    let storyLink = await tab.$$(".alphabet.fandom.index.group li ul li a")
    let storyLinkClicked = await tab.evaluate(function(ele){
        return ele.getAttribute("href")
    },storyLink[0])
    
    tab.goto("https://archiveofourown.org" + storyLinkClicked)

    await tab.waitForSelector("#work_8109805 h4 a", {visible: true})
    let storyBegins = await tab.$$("#work_8109805 h4 a")
    let storyBeginsClicked = await tab.evaluate(function(ele){
        return ele.getAttribute("href")
    },storyBegins[0])
    
    tab.goto("https://archiveofourown.org" + storyBeginsClicked)

    await tab.waitForSelector("#chapters .userstuff p")
    let textContents = await tab.$$("#chapters .userstuff ")

    let textt = await tab.evaluate(() =>
    Array.from(
        document.querySelectorAll("#chapters .userstuff "),
        (element) => element.textContent
        )
    )

    await tab.waitForTimeout(4000)

    tabNew = await browser.newPage()
    
    await tabNew.goto("https://www.tools4noobs.com/summarize/")


    await tabNew.waitForTimeout(5000)
    await tabNew.$$("textarea[id='text']")

    await tabNew.click("textarea[id='text']")
    
    await tabNew.type("textarea[id='text']", textt)
    await tabNew.waitForSelector("input[id='show_relevance']")
    await tabNew.click("input[id='show_relevance']")
    await tabNew.waitForSelector(".btn.btn-primary")
    await tabNew.click(".btn.btn-primary")

    await tabNew.waitForTimeout(6000)
    await tabNew.waitForSelector("#result li")
    let finalText = await tabNew.evaluate(() =>
    Array.from(
        document.querySelectorAll("#result li"),
        (element) => element.textContent
        )
    )
   
    fs.writeFileSync("abc.json", JSON.stringify(finalText))
    browser.close()
}

main()
