package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"text/template"
)

func HandleFilters(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	creationDateStart, err := strconv.Atoi(r.FormValue("creationDateStart"))
	if err != nil {
		ErrorHandler(w, r, http.StatusBadRequest)
	}

	creationDateEnd, err := strconv.Atoi(r.FormValue("creationDateEnd"))
	if err != nil {
		ErrorHandler(w, r, http.StatusBadRequest)
	}

	firstAlbumStart, err := strconv.Atoi(r.FormValue("firstAlbumStart"))
	if err != nil {
		ErrorHandler(w, r, http.StatusBadRequest)
	}

	firstAlbumEnd, err := strconv.Atoi(r.FormValue("firstAlbumEnd"))
	if err != nil {
		ErrorHandler(w, r, http.StatusBadRequest)
	}
	fmt.Println(creationDateStart, creationDateEnd, firstAlbumStart, firstAlbumEnd)

	var selected []int

	// Check each possible member checkbox
	for i := 1; i <= 8; i++ {
		checkboxName := "members" + strconv.Itoa(i)
		if r.FormValue(checkboxName) == "on" {
			selected = append(selected, i)
		}
	}
	var filteredbands []Artist
	fmt.Println(len(ModArtists))

	for _, band := range ModArtists {
		firstAlbumint, err := strconv.Atoi(band.FirstAlbum[6:])
		if err != nil {
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}
		if (band.CreationDate >= creationDateStart && band.CreationDate <= creationDateEnd) && (firstAlbumint >= firstAlbumStart && firstAlbumint <= firstAlbumEnd) {

			if len(selected) >= 1 {
				for _, n := range selected {
					if len(band.Members) == n {
						filteredbands = append(filteredbands, band)
					}
				}
			}
			if len(selected) == 0 {
				filteredbands = append(filteredbands, band)
			}
		}
	}
	tmpl, err := template.ParseFiles("templates/artists.html")
	if err != nil {
		fmt.Printf("error: %v", err)
		ErrorHandler(w, r, http.StatusInternalServerError)
		return
	}
	tmpl.Execute(w, filteredbands)
}
