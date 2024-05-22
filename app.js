//owl components
//usestate es un hook que permite definir estados
//Component es una clase que permite definir componentes
const {Component,mount, xml, useState}=owl;

//componente raiz 
//primero se define la clase

class Task extends Component {
    //se define el template
    static template = xml
    `<li t-attf-style="background-color:#{state.color}" class="d-flex align-items-center justify-content-between border p-3 mb-2 rounded">
    <div t-if="state.isEditing" class="d-flex align-items-center flex-grow-1 me-2" >
    <input type="text" class="form-control me-2" t-model="state.name"/>
    <input type="color" style="width:60px" class="form-control-lg form-control-color border-0" id="Color" t-model="state.color" />
    </div>
    <div t-if="!state.isEditing" class="form-check form-switch fs-5" >
    <input class="form-check-input" type="checkbox" value="" t-att-id="state.id" t-att-checked="state.isCompleted" 
    t-on-click="toggleTask" t-model="state.isCompleted"/>
    <label style="color: aliceblue;" class="form-check-label" t-att-for="state.id" t-attf-class="#{state.isCompleted ? 'text-decoration-line-through' : ''}" >
        <t t-esc="state.name"/>
    </label>
    </div>
    <div>
    <button t-if="!state.isEditing" class="btn btn-warning me-2" t-on-click="editTask"> <i class="bi bi-pencil"></i> </button>
    <button t-if="state.isEditing" class="btn btn-success me-2" t-on-click="saveTask"> <i class="bi bi-check-lg"></i> </button>
    <button class="btn btn-danger" t-on-click="deleteTask"> <i class="bi bi-trash"></i> </button>
    </div>
        </li>`
        //despues de la plantilla definimos el hook setup, o propiedades
        //tambien la propiedad de eliminar 
    static props = ["task","onDelete","onEdit"];
    //usamos props para acceder a las propiedades del componente padre

    setup(){

        this.state = useState({
        isEditing: false,
        id:this.props.task.id,
        name:this.props.task.name,
        color:this.props.task.color,
        isCompleted: this.props.task.isCompleted,
        });
    }

    toggleTask(){
        //cambio de estado de la tarea
        this.state.isCompleted = !this.state.isCompleted;
    }
    deleteTask(){
        //eliminar tarea
        this.props.onDelete(this.props.task);
    } 
    editTask(){
        this.state.isEditing = true;
    }                  
    saveTask(){
        this.state.isEditing = false;
        //procedemos a guardar la tarea y envairla al componente padre
        this.props.onEdit(this.state);
    }
}

class Root extends Component{
    //se define el template
    //se define el template
    //en le apartaado de lkas tareas se define un listado de tareas con un t foreach
    static template = xml 
    `
    <div>
      <div class="input-group-lg w-100 d-flex border p-2">
       <input type="text" class="form-control-lg flex-fill border-0" placeholder="Ingrese la actividad" aria-label="Example text with button addon" aria-describedby="button-addon1" t-att-value="state.name" t-model="state.name"/>
       <input type="color" class="form-control-lg form-control-color border-0" id="exampleColorInput" t-att-value="state.color" title="Choose your color" t-model="state.color"/>
       <button class="btn btn-success" type="button" id="button-addon1" t-on-click="addTask"><i class="bi bi-plus"></i></button>
      </div>
    </div>

    <ul class="d-flex flex-column mt-5 p-0" >
      <t t-foreach="tasks" t-as="task" t-key="task.id">
        <Task task="task" onDelete.bind="deleteTask" onEdit.bind="editTask"/>
      </t>
    </ul>`;

    //incoacmos el componnete Task
    static components = {Task};
    //el hook setup seimpre se carga luego de renderizar el template
    setup(){
        this.state = useState({
            name:"",
            color:'#333399',
            isCompleted: false,
        });

      //se define el estado
      this.tasks = useState([]);
    }

    addTask(){
       // console.log(this.state);

       //condicion para que no se agrege una tarea vacia
         if(this.state.name === ""){
            alert("Ingrese una tarea");
            return;
         }
       this.tasks.push({
           id: Date.now(),
           name: this.state.name,
           color: this.state.color,
           isCompleted: false,
       });
       let state = this.state
       this.state={...state, name: "",color: '#333399'};

    }
    deleteTask(task){
        const index = this.tasks.findIndex((t) => t.id === task.id);
        this.tasks.splice(index, 1);
    }
    editTask(task){
        const index = this.tasks.findIndex((t) => t.id === task.id);
        this.tasks.slice(index,1,task);
    }

}


mount(Root, document.getElementById('app')) ;

