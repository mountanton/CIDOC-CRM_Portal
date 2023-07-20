/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package classes;

/**
 *
 * @author Theo
 */
public class RDFClass {

    public int id;
    public String url;
    public int triples;
    public int requestSize;

    public RDFClass() {

    }

    public RDFClass(int id, String url, int triples, int requestSize) {
        this.id = id;
        this.url = url;
        this.triples = triples;
        this.requestSize = requestSize;
    }
}
