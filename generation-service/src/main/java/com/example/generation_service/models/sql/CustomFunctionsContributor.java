package com.example.generation_service.models.sql;

import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.boot.model.FunctionContributor;

public class CustomFunctionsContributor implements FunctionContributor {

    @Override
    public void contributeFunctions(FunctionContributions functionContributions) {
        functionContributions.getFunctionRegistry()
                .register("fts_search", new FullTextSearchSQLFunction("fts_search"));

        functionContributions.getFunctionRegistry()
                .register("generate_tsvector", new GenerateTSVectorSQLFunction());
    }
}
