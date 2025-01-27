package com.example.generation_service.models.activity;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Builder
@Jacksonized
@Getter
public class AllTestGenerationActivitiesCount {

    private final long count;
}
