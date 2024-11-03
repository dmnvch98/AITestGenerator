package com.example.generation_service.models.sql;

import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.sql.ast.SqlAstTranslator;
import org.hibernate.sql.ast.spi.SqlAppender;
import org.hibernate.sql.ast.tree.SqlAstNode;
import org.hibernate.type.SqlTypes;
import org.hibernate.type.BasicTypeReference;

import java.util.List;

public class GenerateTSVectorSQLFunction extends StandardSQLFunction {

    private static final BasicTypeReference<Object> RETURN_TYPE =
            new BasicTypeReference<>("tsvector", Object.class, SqlTypes.OTHER);

    public GenerateTSVectorSQLFunction() {
        super("generate_tsvector", true, RETURN_TYPE);
    }

    @Override
    public void render(SqlAppender sqlAppender, List<? extends SqlAstNode> arguments, SqlAstTranslator<?> translator) {
        if (arguments.size() < 2) {
            throw new IllegalArgumentException("Function 'generate_tsvector' requires at least 2 arguments");
        }

        sqlAppender.append("to_tsvector(");

        // Добавляем первую часть аргумента с COALESCE и NULLIF для всех аргументов
        for (int i = 0; i < arguments.size(); i++) {
            if (i > 0) {
                sqlAppender.append(" || ' ' || ");
            }
            sqlAppender.append("COALESCE(NULLIF(");
            arguments.get(i).accept(translator);
            sqlAppender.append(", ''), '')");
        }

        sqlAppender.append(")::tsvector"); // Приведение результата к типу tsvector
    }
}
