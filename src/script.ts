
const taskElem = document.querySelector('.task')
const doneElem = document.querySelector('.done')
const skipElem = document.querySelector('.skip')
const clerElem = document.querySelector('.remove-progress')
const progressElem = document.querySelector('#scale')
const URLTaskRequest = ''

class Taskmenu {
    buttonNext: Element | null
    taskText: Element | null
    scale: Element | null
    taskCurrent: string
    arrTasks: string[]
    skipFlag: boolean
    skip: Element | null
    counting: {count: number, remained: number}
    idTask: string | null
    clear: Element | null
    
    constructor(
        butDOM: Element | null, 
        taskDOM: Element | null, 
        scaleDom: Element | null, 
        skipDom : Element | null, 
        clearDom: Element | null
        ) {
        this.buttonNext = butDOM
        this.taskText = taskDOM
        this.scale = scaleDom
        this.skip = skipDom
        this.clear = clearDom
        this.taskCurrent = ''
        this.idTask = ''
        this.skipFlag = false
        this.arrTasks = []
        this.counting = {count: 0, remained: 0}
    }

    _outTask() {
        if (!this.taskText) return
        this.taskText.textContent = this.taskCurrent
    }

    _updateArrTasks({arr, tasksLength} : {arr: string[], tasksLength: number}){
        if(!Array.isArray(arr)) return
        this.arrTasks = arr
        this.counting.count = tasksLength
        this.counting.remained = arr.length
        this._selectionRandomTask()
    }

    _selectionRandomTask(){
        let max = this.counting.remained
        if(max == 0) return
        let randomTask = Math.floor(Math.random() * (max - 0) + 0)
        this.idTask = this.arrTasks[randomTask]
        this._taskRequest()
    }

    async _taskRequest(){
        const idTask = this.idTask
        const data = await fetch(URLTaskRequest + '/task/' + idTask)
        const task = await data.json()
        if("err" in task) console.error(task.err)
        if(!task.text) return
        this.taskCurrent = task.text
        this._outTask()
    }

    async _cookieUpdate(){
        const idTask = this.idTask
        if(idTask){
            await fetch(URLTaskRequest + '/cookies/' + idTask)
        }
        
        await this._tasksRequest()
    }


    async _cookieClear(){
        await fetch(URLTaskRequest + '/cookies/',{
            method: 'DELETE'
        })
        this.counting.count = 100
        this.counting.remained = 100
        this._progressUpdate()
    }

    _progressUpdate(){
        if(!this.scale) return
        if(this.scale.parentNode){
            const elem = this.scale.parentNode as HTMLElement
            elem.classList.remove('notvisible')
        }
        this.scale.setAttribute("max", String (this.counting.count))
        let n = this.counting.count - this.counting.remained
        this.scale.setAttribute("value", String(n))
    }

    async _tasksRequest() {
        const data = await fetch(URLTaskRequest + '/tasks')
        const tasks = await data.json()
        if("err" in tasks) console.error(tasks.err)
        if(!tasks.data) return
        this._updateArrTasks({arr:tasks.data.arr, tasksLength: tasks.data.tasksLength})
        this._progressUpdate()
    }

    hengEvents() {
        this.buttonNext?.addEventListener('click', () => {
            this.skipFlag = false
            this._cookieUpdate()
        })
        this.skip?.addEventListener('click', () => {
            this.skipFlag = true
            this._tasksRequest()
        })
        this.clear?.addEventListener('click', () => {
            this._cookieClear()
        })
        
    }
}

const menu = new Taskmenu(doneElem, taskElem, progressElem, skipElem, clerElem)

menu.hengEvents()






