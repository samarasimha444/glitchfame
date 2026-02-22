package com.example.glitchfame.Controller.adminController.AdminSeasonController;

import com.example.glitchfame.Service.AdminService.AdminSeasonService.GetSeasonService;
import com.example.glitchfame.dto.AdminDTO.AdminSeasonDTO.GetSeasonDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/seasons")
@RequiredArgsConstructor
public class GetSeasonController {

    private final GetSeasonService getSeasonService;

    @GetMapping
    public ResponseEntity<Page<GetSeasonDTO>> getAllSeasons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        if (page < 0) page = 0;
        if (size <= 0) size = 10;

        Page<GetSeasonDTO> seasons =
                getSeasonService.getAllSeasons(page, size);

        return ResponseEntity.ok(seasons);
    }

    //get by id
    @GetMapping("/{id}")
public ResponseEntity<GetSeasonDTO> getSeasonById(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            getSeasonService.getSeasonById(id)
    );
}
}