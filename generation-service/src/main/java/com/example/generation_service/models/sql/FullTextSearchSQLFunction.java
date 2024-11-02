package com.example.generation_service.models.sql;

import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.sql.ast.SqlAstTranslator;
import org.hibernate.sql.ast.spi.SqlAppender;
import org.hibernate.sql.ast.tree.SqlAstNode;
import org.hibernate.type.BasicTypeReference;
import org.hibernate.type.SqlTypes;

import java.util.List;

public class FullTextSearchSQLFunction extends StandardSQLFunction {

    private static final BasicTypeReference<Boolean> RETURN_TYPE =
            new BasicTypeReference<>("boolean", Boolean.class, SqlTypes.BOOLEAN);

    public FullTextSearchSQLFunction(final String functionName) {
        super(functionName, true, RETURN_TYPE);
    }

    @Override
    public void render(SqlAppender sqlAppender, List<? extends SqlAstNode> arguments, SqlAstTranslator<?> translator) {
        if (arguments.size() != 3) {
            throw new IllegalArgumentException("Function '" + getName() + "' requires exactly 3 arguments");
        }

        sqlAppender.append("(");
        arguments.get(0).accept(translator);
        sqlAppender.append(" @@ to_tsquery(");

        arguments.get(1).accept(translator);
        sqlAppender.append(", ");

        arguments.get(2).accept(translator);
        sqlAppender.append("))");
    }
}
