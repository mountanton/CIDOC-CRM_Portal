/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package requestClasses;

/**
 *
 * @author Theo
 */
public class RequestCommon {

    public String endpoint1;
    public String endpoint2;
    public boolean onlyCIDOC;
    public int limit;
    public int page;
    public int totalEntries = 0;

    public RequestCommon(String endpoint1, String endpoint2, boolean onlyCIDOC, int limit, int page) {
        this.endpoint1 = endpoint1;
        this.endpoint2 = endpoint2;
        this.onlyCIDOC = onlyCIDOC;
        this.limit = limit;
        this.page = page;
    }
}
