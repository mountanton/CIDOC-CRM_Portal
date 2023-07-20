/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package models;

/**
 *
 * @author Theo
 */
public class GlobalSearchResponse {

    public String dataset;
    public int triples;
    public int requestSize;

    public GlobalSearchResponse(String dataset, int triples, int requestSize) {
        this.dataset = dataset;
        this.triples = triples;
        this.requestSize = requestSize;
    }
}
