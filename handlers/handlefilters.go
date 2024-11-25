package handlers

import (
	"fmt"
	"net/http"
)

func HandleFilters(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.FormValue("creationDateStart"))
	fmt.Println(r.FormValue("creationDateEnd"))
	fmt.Println(r.FormValue("creationYearStart"))
	fmt.Println(r.FormValue("creationYearEnd"))

	fmt.Println(r.FormValue("creationDateStart"))

}
