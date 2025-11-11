package com.autodealer.server.entity;

public class SearchResultDTO {
    private String type; // "vehicle" or "brand"
    private Object data;

    public SearchResultDTO(String type, Object data) {
        this.type = type;
        this.data = data;
    }

    public String getType() {
        return type;
    }

    public Object getData() {
        return data;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
