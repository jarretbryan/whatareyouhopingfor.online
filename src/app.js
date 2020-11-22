// TO DO
// Figure out how to scroll on submission click
// get more dynamic responses in answer column

// NEW TO DO
// Add in bouncing CSS arrow
// More Dynamic Responses?

document.addEventListener('DOMContentLoaded', () => {
    // WHAT IF I JUST PUT EVERYTHING IN ONE MASSIVE JS FILE
    // you aren't supposed to do this! 
    // I got tired of organizing things.
    // What are you going to do, call the cops?

    const app = (() => {
        console.log("Social is the place to be see and be seen.")
        const leftQuestions = document.getElementById('left-questions')
        const printButton = document.getElementById('print')
        const printLink = document.getElementById('print-link')
        let questions = STORE
        let calledQuestions = []
        let results = []
        let date = Date()
        let count = 1

        // these are odd: need to fix:
        document.getElementById('name').addEventListener("submit", (e) => { eventListeners.onSubmit(e) })
        printButton.addEventListener("click", () => {eventListeners.onPrint()})

        return {
            leftQuestions,
            results,
            date,
            questions,
            calledQuestions,
            printButton,
            printLink,
            count
        }
    })()

    const eventListeners = {
        onSubmit: function onSubmit (event) {
            event.preventDefault()
            question.storeAnswer(event.target.id, event.target.children[0].children[2].value) // THIS IS SO JANKY
            question.renderAnswer(event.target)
            if ((app.questions.open.filter(q => !app.calledQuestions.includes(q))).length > 0){
                question.renderQuestionForm()
            }
            console.log('Aspect Submitted')
        },
        onPrint: function onPrint(){
            console.log('printing')
            let receipt = templates.receiptHTML()
            let myBlob = printing.makeBlob(receipt)
            let downloadFile = window.URL.createObjectURL(myBlob)
            app.printLink.href = downloadFile
        }
    }


    const question = {
        renderQuestionForm: function renderQuestionForm() {
            const newQuestion = question.get(app.questions.open)
            // const newQuestion = question.get(app.questions.open.filter(q => !app.calledQuestions.includes(q))) // this results in an unhandled error
            let newForm = document.createElement("form")
            newForm.className="card question"
            newForm.id = newQuestion.shorthand

            newForm.innerHTML = `
                <div>
                    <p>${newQuestion.prompt}</p>
                    <label for="input-${newQuestion.shorthand}">${newQuestion.prompt}</label>
                    <input required type="text" id="input-${newQuestion.shorthand}" placeholder=${newQuestion.shorthand}>
                    <input type="submit" value="-->">
                </div>`

            newForm.addEventListener("submit", (e) => eventListeners.onSubmit(e))
            app.leftQuestions.appendChild(newForm)
        },

        get: function get(arr) {
            // this was originally going to be random, but maybe not anymore. maybe it should go in order? I don't know what I want to do here.
            // let r = Math.floor(Math.random() * arr.length);
            // let q = arr[r];
            let q = arr[app.count]
            app.count++
            return q;
        },

        storeAnswer: function storeAnswer(qShortHand, answer) {
            let k = app.questions.open.find(q => q.shorthand === qShortHand)
            app.calledQuestions.push(k)
            app.results.push({q:k,a:answer})
        },

        // objectively janky function i hate it
        renderAnswer: function renderAnswer(element) {
            let box = element.children[0].children[2]
            let arrow = element.children[0].children[3]
            let value = box.value
            let t = document.createElement("p")
            let prompt = document.createElement("div")
            prompt.innerText = '⭣' 
            prompt.className = "arrow"
            t.innerText = value
            box.remove()
            arrow.remove()
            element.children[0].appendChild(t)
            element.children[0].appendChild(prompt)
                
        }
    }

    const printing = {
        makeBlob: function makeBlob(string) {
            let blob = new Blob([string], { type: "text/plain;charset=utf-8" });
            let file = new File([blob], "document.html", {
                type: "text/plain",
            });
            return file
        },

    }

    // this is the messiest least effective way
    const templates = {
        receiptStyles: `<style>
                            * {
                                font-size: 12px;
                                font-family: 'Times New Roman';
                            }

                            td,
                            th,
                            tr,
                            table {
                                border-top: 1px solid black;
                                border-collapse: collapse;
                            }

                            td.description,
                            th.description {
                                width: 75px;
                                max-width: 75px;
                            }

                            td.quantity,
                            th.quantity {
                                width: 40px;
                                max-width: 40px;
                                word-break: break-all;
                            }

                            td.price,
                            th.price {
                                width: 40px;
                                max-width: 40px;
                                word-break: break-all;
                            }

                            .centered {
                                text-align: center;
                                align-content: center;
                            }

                            .ticket {
                                width: 155px;
                                max-width: 155px;
                                box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
                            }

                            img {
                                max-width: inherit;
                                width: inherit;
                            }

                            @media print {
                                .hidden-print,
                                .hidden-print * {
                                    display: none !important;
                                }
                            }
                        </style>`,
        receiptHTML: function receiptHTML() {
            return `<!DOCTYPE html>
                    <html lang="en">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                        ${templates.receiptStyles}
                    </head>

                    <body onload="window.print()">
                        <div class="ticket">
                            <!-- <img src="./logo.png" alt="Logo"> -->
                            <p class="centered">PROOF
                                <br>Congrats on Your
                                <br>Online Validation</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th class="quantity">Q.</th>
                                        <th class="description">ITEM</th>
                                        <th class="price">$$</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${app.results.map(result => `<tr>
                                        <td class="quantity">1.00</td>
                                        <td class="description">${result.q.prompt}:${result.a}</td>
                                        <td class="price">$0.00</td>
                                    </tr>`).join("")}
                                </tbody>
                            </table>
                            <p class="centered">Thanks for your participation! Show others this receipt as proof that you were online!
                                <br>What were you hoping for?</p>
                        </div>
                    </body>
                    </html>`
        }
    }
})