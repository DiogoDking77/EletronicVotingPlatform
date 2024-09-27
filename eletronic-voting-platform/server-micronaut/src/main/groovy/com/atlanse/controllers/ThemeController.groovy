package com.atlanse.controllers

import com.atlanse.domains.ThemeEntity
import com.atlanse.services.ThemeService
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Patch
import io.micronaut.http.annotation.Post
import jakarta.inject.Inject

@Controller("/api/theme")
class ThemeController {

    @Inject
    ThemeService themeService

    @Get("/{id}")
    HttpResponse<ThemeEntity> getTheme(UUID id) {
        return HttpResponse.ok(themeService.findById(id))
    }

    @Get("/")
    HttpResponse<Page<ThemeEntity>> getThemes(Pageable pageable) {
        return HttpResponse.ok(themeService.findAll(pageable))
    }

    @Post
    HttpResponse<ThemeEntity> createTheme(@Body String themeName) {
        return HttpResponse.created(themeService.create(themeName))
    }

    @Patch("/{id}")
    HttpResponse<ThemeEntity> update(UUID id, String themeName) {
        return HttpResponse.ok(themeService.update(id, themeName))
    }

    @Delete("/{id}")
    HttpResponse delete(UUID id) {
        themeService.delete(id)
        return HttpResponse.noContent()
    }

    @Get("/ordered")
    HttpResponse<List<ThemeEntity>> getThemesordered() {
        List<ThemeEntity> themes = themeService.getThemesordered()
        return HttpResponse.ok(themes)
    }
}
