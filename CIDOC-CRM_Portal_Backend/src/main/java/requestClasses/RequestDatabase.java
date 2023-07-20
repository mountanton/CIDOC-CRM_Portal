/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package requestClasses;

/**
 *
 * @author Theo
 */
public class RequestDatabase {

    public String endpoint;
    public boolean onlyCidoc;
    public int limit;
    public int page;
    public int totalEntries;

    public RequestDatabase(String endpoint, boolean onlyCidoc, int limit, int page) {
        this.endpoint = endpoint;
        this.onlyCidoc = onlyCidoc;
        this.limit = limit;
        this.page = page;
    }
}
