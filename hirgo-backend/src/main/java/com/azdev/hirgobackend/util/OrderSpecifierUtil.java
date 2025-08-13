package com.azdev.hirgobackend.util;

import com.azdev.hirgobackend.models.category.QCategory;
import com.azdev.hirgobackend.models.company.QCompany;
import com.azdev.hirgobackend.models.vacancy.QVacancy;
import com.azdev.hirgobackend.models.vacancy.QVacancyView;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import java.util.Map;
import java.util.Objects;
import org.springframework.data.domain.Sort;


public class OrderSpecifierUtil {

    public static OrderSpecifier<?>[] getSortedColumn(Sort sort) {
        PathBuilder<?> vacancyPath = new PathBuilder<>(QVacancy.class, "vacancy");
        PathBuilder<?> companyPath = new PathBuilder<>(QCompany.class, "company");
        PathBuilder<?> categoryPath = new PathBuilder<>(QCategory.class, "category");
        PathBuilder<?> vacancyViewsPath = new PathBuilder<>(QVacancyView.class, "vacancyViews");

        Map<String, PathBuilder<?>> pathBuilders = Map.of(
                "vacancy", vacancyPath,
                "company", companyPath,
                "category", categoryPath,
                "vacancy_views", vacancyViewsPath // Snake case in URL, camelCase in code
        );

        // Default to vacancy for simple properties

        return sort.stream().map(order -> {
            Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;
            String propertySnakeCase = order.getProperty();

            // Convert snake_case to camelCase
            String property = convertSnakeCaseToCamelCase(propertySnakeCase);

            if (!property.contains(".")) {
                // Simple property (like "id") - use the default path (vacancy)
                return new OrderSpecifier<>(direction, vacancyPath.getComparable(property, Comparable.class));
            }

            // Handle dotted path (like "vacancy.id" or "vacancy.posted_at" → "vacancy.postedAt")
            String[] props = property.split("\\.");
            if (props.length < 1) return null;

            String root = props[0];

            // Check if the root exists in snake_case form
            PathBuilder<?> builder = pathBuilders.get(root);
            if (builder == null) {
                // Try original snake case key
                builder = pathBuilders.get(propertySnakeCase.split("_")[0]);
            }

            if (builder == null) return null;

            PathBuilder<?> current = builder;
            for (int i = 1; i < props.length - 1; i++) {
                current = current.get(props[i]);
            }

            String finalProp = props[props.length - 1];
            return new OrderSpecifier<>(direction, current.getComparable(finalProp, Comparable.class));
        }).filter(Objects::nonNull).toArray(OrderSpecifier[]::new);
    }

    /**
     * Converts a snake_case string to camelCase
     * Example: "posted_at" → "postedAt"
     */
    private static String convertSnakeCaseToCamelCase(String snakeCase) {
        if (snakeCase == null || snakeCase.isEmpty()) {
            return snakeCase;
        }

        // Split by underscore
        String[] parts = snakeCase.split("_");
        StringBuilder camelCase = new StringBuilder(parts[0].toLowerCase());

        // Capitalize the first letter of each remaining part
        for (int i = 1; i < parts.length; i++) {
            if (!parts[i].isEmpty()) {
                camelCase.append(Character.toUpperCase(parts[i].charAt(0)));
                if (parts[i].length() > 1) {
                    camelCase.append(parts[i].substring(1).toLowerCase());
                }
            }
        }

        return camelCase.toString();
    }

}
