import React from 'react'

const MovieCategoryForm = ({handleSubmit,value,setValue}) => {
  return (
    <>
    <form onSubmit={handleSubmit}>
  <div className="mb-3">
    
    <input type="text" className="form-control" placeholder="Enter new Genre" value={value} onChange={(e) => setValue(e.target.value)}/>
    
  </div>

  <button type="submit" className="btn btn-primary">Submit</button>
</form>

    </>
  )
}

export default MovieCategoryForm