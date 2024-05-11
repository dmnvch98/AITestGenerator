package com.example.aitestgenerator.holder;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import org.springframework.stereotype.Component;

@Component
public class TestGeneratingHistoryHolder {

    private final ThreadLocal<TestGeneratingHistory> historyThreadLocal = new ThreadLocal<>();

    public void clearHistory() {
        historyThreadLocal.remove();
    }

    public TestGeneratingHistory getHistory() {
        return historyThreadLocal.get();
    }

    public void setHistory(TestGeneratingHistory requestInfo) {
        historyThreadLocal.set(requestInfo);
    }
}
