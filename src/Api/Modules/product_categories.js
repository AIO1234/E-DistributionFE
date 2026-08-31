import { api } from "../index"

export default {
  // all category details   
  async AllCategory(payload){
    return await api.post(`/categories/allcategories`, payload)
  },

  // add category
  async AddCategory(payload){
    return await api.post(`/categories/storecategory`, payload)
  },
    

  // update category
  async UpdateCategory(id, payload){
    return await api.put(`/categories/updatecategory/${id}`, payload)
  },
}
