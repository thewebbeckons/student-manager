import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store ({
    state : {
        students: []
    },
    getters: {
      students: state => state.students.map(s => ({...s, fullName: s.firstName + ' ' + s.lastName})),
      findStudent: state => id => state.students.find(s => s.id == id),
      isLoaded: state => !!state.students.length
    },
    mutations: {
      setStudents(state, students) {
        state.students = students
      },
      addStudent(state, student) {
        state.students.push(student)
      },
      editStudent(state, student) {
        const index = state.students.findIndex(s => s.id == student.id)        
        Vue.set(state.students, index, student)
      }
    },
    actions: {
      async getStudents(context) {
        let students = (await axios.get('http://localhost:3000/students')).data
        context.commit('setStudents', students)
      },
      async createStudent(context, names) {
        const student = (await axios.post("http://localhost:3000/students", names )).data;
        context.commit('addStudent', student)
      },
      async editStudent(context, {id, names}) {
        const student = (await axios.put(`http://localhost:3000/students/${id}`, names)).data;
        context.commit('editStudent', student)
      }
    }
})